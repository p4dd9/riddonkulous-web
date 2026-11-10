import { getClientIp } from '@/app/lib/clientIp'
import { claimPromoCode, getPromoWord, isLockedOut, noteWrongTry, playRedeemUrl } from '@/app/lib/promoCodes'
import { serverLogger } from '@/app/util/logger'
import { NextRequest, NextResponse } from 'next/server'

const CLAIM_COOKIE = 'riddonk_promo'
const YEAR_SECONDS = 60 * 60 * 24 * 365

const reply = (body: object, status = 200) =>
	NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/** POST only, so link previews and crawlers never use up a code. */
export const POST = async (request: NextRequest) => {
	// Only the landing page itself may ask.
	const origin = request.headers.get('origin')
	if (origin && URL.canParse(origin) && new URL(origin).host !== request.headers.get('host')) {
		return reply({ error: 'Not allowed.' }, 403)
	}

	const ip = getClientIp(request)
	if (isLockedOut(ip)) {
		return reply({ error: 'Too many wrong tries. Wait ten minutes and try again.' }, 429)
	}

	let word = ''
	try {
		const body = await request.json()
		word = typeof body?.word === 'string' ? body.word : ''
	} catch {
		return reply({ error: 'Invalid request.' }, 400)
	}

	if (word.trim().toUpperCase() !== getPromoWord()) {
		noteWrongTry(ip)
		return reply({ error: 'That is not the word.' }, 401)
	}

	try {
		const result = await claimPromoCode(request.cookies.get(CLAIM_COOKIE)?.value, ip)

		if (result.status === 'empty') {
			return reply({ error: 'All codes are gone. Thanks for playing!' }, 410)
		}

		const response = reply({ code: result.code, url: playRedeemUrl(result.code) })
		response.cookies.set(CLAIM_COOKIE, result.id, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: YEAR_SECONDS,
		})
		return response
	} catch (error) {
		serverLogger.error(`Promo code claim failed: ${error}`)
		return reply({ error: 'Something went wrong. Try again later.' }, 500)
	}
}
