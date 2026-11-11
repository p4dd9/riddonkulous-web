import { createHash, randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * Store promo codes handed out one per visitor and platform from the landing page.
 *
 * Android: `codes.csv` is Play Console's export (one code per line under a
 * header) and `claims.json` records who got which code.
 * iOS: `codes_ios.csv` is App Store Connect's offer code export (code, redeem
 * link per line) and `claims_ios.json` records the claims.
 *
 * All of them live in PROMO_CODES_DIR, which is a mounted volume in production
 * (see docker-compose.yml) because a deploy replaces the whole checkout. None
 * of these files is ever committed.
 */

export type PromoPlatform = 'android' | 'ios'

const FILES: Record<PromoPlatform, { codes: string; claims: string }> = {
	android: { codes: 'codes.csv', claims: 'claims.json' },
	ios: { codes: 'codes_ios.csv', claims: 'claims_ios.json' },
}

export const isPromoPlatform = (value: unknown): value is PromoPlatform => value === 'android' || value === 'ios'

/** Riddonkulous on the App Store, as in APP_STORE_URL (app/lib/appLinks.ts). */
const APP_STORE_APP_ID = '6760267855'

const DAY_MS = 24 * 60 * 60 * 1000

interface Claim {
	id: string
	code: string
	ipHash: string | null
	at: number
}

/** One line of a codes file: the code and, when the export has one, its redeem link. */
interface CodeEntry {
	code: string
	url: string | null
}

export type ClaimResult = { status: 'ok'; id: string; code: string; url: string } | { status: 'empty' }

const getDir = () => process.env.PROMO_CODES_DIR || path.join(process.cwd(), 'data', 'promo')

/** The word a visitor types before a code is handed out. */
export const getPromoWord = () => (process.env.PROMO_WORD || 'RIDDONK').trim().toUpperCase()

/** Only a store's own redeem page is ever sent to a visitor. */
const REDEEM_HOSTS: Record<PromoPlatform, string> = { android: 'play.google.com', ios: 'apps.apple.com' }

/** Fallback for a code whose line has no (valid) redeem link. */
const buildRedeemUrl = (platform: PromoPlatform, code: string) =>
	platform === 'ios'
		? `https://apps.apple.com/redeem?ctx=offercodes&id=${APP_STORE_APP_ID}&code=${encodeURIComponent(code)}`
		: `https://play.google.com/redeem?code=${encodeURIComponent(code)}`

const hashIp = (ip: string) => createHash('sha256').update(`riddonk-promo:${ip}`).digest('hex').slice(0, 32)

const readCodes = async (platform: PromoPlatform): Promise<CodeEntry[]> => {
	try {
		const csv = await fs.readFile(path.join(getDir(), FILES[platform].codes), 'utf8')
		return csv
			.split(/\r?\n/)
			.map((line) => {
				const [code = '', link = ''] = line.split(',').map((cell) => cell.replace(/"/g, '').trim())
				const isStoreLink =
					URL.canParse(link) &&
					new URL(link).protocol === 'https:' &&
					new URL(link).host === REDEEM_HOSTS[platform]
				return { code, url: isStoreLink ? link : null }
			})
			.filter((entry) => /^[A-Z0-9]{8,}$/.test(entry.code))
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
		throw error
	}
}

const readClaims = async (platform: PromoPlatform): Promise<Claim[]> => {
	try {
		return JSON.parse(await fs.readFile(path.join(getDir(), FILES[platform].claims), 'utf8')) as Claim[]
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
		throw error
	}
}

/** Write next to the file and rename, so a crash never leaves half a claims file. */
const writeClaims = async (platform: PromoPlatform, claims: Claim[]) => {
	const file = path.join(getDir(), FILES[platform].claims)
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
 * Hand out the next unused code for a platform. A visitor who already has one
 * for that platform (same claim cookie, or the same IP within 24 hours) gets
 * that code again instead of a new one.
 */
export const claimPromoCode = (
	platform: PromoPlatform,
	claimId: string | undefined,
	ip: string | null
): Promise<ClaimResult> =>
	inTurn(async () => {
		const [codes, claims] = await Promise.all([readCodes(platform), readClaims(platform)])
		const now = Date.now()
		const ipHash = ip ? hashIp(ip) : null

		const mine =
			(claimId && claims.find((claim) => claim.id === claimId)) ||
			(ipHash && claims.find((claim) => claim.ipHash === ipHash && now - claim.at < DAY_MS))
		// The link from the codes file, or a built one when the file has none.
		const urlFor = (code: string) =>
			codes.find((entry) => entry.code === code)?.url ?? buildRedeemUrl(platform, code)

		if (mine) {
			return { status: 'ok', id: mine.id, code: mine.code, url: urlFor(mine.code) }
		}

		const taken = new Set(claims.map((claim) => claim.code))
		const next = codes.find((candidate) => !taken.has(candidate.code))
		if (!next) {
			return { status: 'empty' }
		}

		const claim: Claim = { id: randomUUID(), code: next.code, ipHash, at: now }
		await writeClaims(platform, [...claims, claim])
		return { status: 'ok', id: claim.id, code: next.code, url: urlFor(next.code) }
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
