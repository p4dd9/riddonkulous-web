import { createHash, randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * Google Play promo codes handed out one per visitor from the landing page.
 *
 * `codes.csv` is Play Console's export (one code per line under a header) and
 * `claims.json` records who got which code. Both live in PROMO_CODES_DIR, which
 * is a mounted volume in production (see docker-compose.yml) because a deploy
 * replaces the whole checkout. Neither file is ever committed.
 */

const DAY_MS = 24 * 60 * 60 * 1000

interface Claim {
	id: string
	code: string
	ipHash: string | null
	at: number
}

export type ClaimResult =
	| { status: 'ok'; id: string; code: string }
	| { status: 'empty' }

const getDir = () => process.env.PROMO_CODES_DIR || path.join(process.cwd(), 'data', 'promo')

/** The word a visitor types before a code is handed out. */
export const getPromoWord = () => (process.env.PROMO_WORD || 'RIDDONK').trim().toUpperCase()

export const playRedeemUrl = (code: string) => `https://play.google.com/redeem?code=${encodeURIComponent(code)}`

const hashIp = (ip: string) => createHash('sha256').update(`riddonk-promo:${ip}`).digest('hex').slice(0, 32)

const readCodes = async (): Promise<string[]> => {
	try {
		const csv = await fs.readFile(path.join(getDir(), 'codes.csv'), 'utf8')
		return csv
			.split(/\r?\n/)
			.map((line) => line.split(',')[0].replace(/"/g, '').trim())
			.filter((line) => /^[A-Z0-9]{8,}$/.test(line))
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
		throw error
	}
}

const readClaims = async (): Promise<Claim[]> => {
	try {
		return JSON.parse(await fs.readFile(path.join(getDir(), 'claims.json'), 'utf8')) as Claim[]
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
		throw error
	}
}

/** Write next to the file and rename, so a crash never leaves half a claims file. */
const writeClaims = async (claims: Claim[]) => {
	const file = path.join(getDir(), 'claims.json')
	const temp = `${file}.${process.pid}.tmp`
	await fs.writeFile(temp, JSON.stringify(claims, null, '\t'), 'utf8')
	await fs.rename(temp, file)
}

// One claim at a time: two requests can never be handed the same code. The site
// runs as a single container, so an in-process queue is enough.
let queue: Promise<unknown> = Promise.resolve()

const inTurn = <T>(task: () => Promise<T>): Promise<T> => {
	const run = queue.then(task, task)
	queue = run.catch(() => undefined)
	return run
}

/**
 * Hand out the next unused code. A visitor who already has one (same claim
 * cookie, or the same IP within 24 hours) gets that code again instead of a
 * new one.
 */
export const claimPromoCode = (claimId: string | undefined, ip: string | null): Promise<ClaimResult> =>
	inTurn(async () => {
		const [codes, claims] = await Promise.all([readCodes(), readClaims()])
		const now = Date.now()
		const ipHash = ip ? hashIp(ip) : null

		const mine =
			(claimId && claims.find((claim) => claim.id === claimId)) ||
			(ipHash && claims.find((claim) => claim.ipHash === ipHash && now - claim.at < DAY_MS))
		if (mine) {
			return { status: 'ok', id: mine.id, code: mine.code }
		}

		const taken = new Set(claims.map((claim) => claim.code))
		const code = codes.find((candidate) => !taken.has(candidate))
		if (!code) {
			return { status: 'empty' }
		}

		const claim: Claim = { id: randomUUID(), code, ipHash, at: now }
		await writeClaims([...claims, claim])
		return { status: 'ok', id: claim.id, code }
	})

// Wrong words per IP: 5 tries, then a 10 minute pause.
const MAX_WRONG_TRIES = 5
const WRONG_TRY_WINDOW_MS = 10 * 60 * 1000
const wrongTries = new Map<string, { count: number; resetAt: number }>()

export const isLockedOut = (ip: string | null): boolean => {
	const entry = wrongTries.get(ip ?? 'unknown')
	if (!entry) return false
	if (Date.now() > entry.resetAt) {
		wrongTries.delete(ip ?? 'unknown')
		return false
	}
	return entry.count >= MAX_WRONG_TRIES
}

export const noteWrongTry = (ip: string | null) => {
	const key = ip ?? 'unknown'
	const now = Date.now()
	const entry = wrongTries.get(key)
	if (!entry || now > entry.resetAt) {
		wrongTries.set(key, { count: 1, resetAt: now + WRONG_TRY_WINDOW_MS })
	} else {
		entry.count += 1
	}
	if (wrongTries.size > 5000) {
		for (const [k, value] of wrongTries) {
			if (now > value.resetAt) wrongTries.delete(k)
		}
	}
}
