import type { NextRequest } from 'next/server'

const isIpLike = (value: string) => {
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) {
		return true
	}
	if (value.includes(':')) {
		return true
	}
	return false
}

/** First public IP from X-Forwarded-For, else X-Real-IP, else null. */
export const getClientIp = (request: NextRequest): string | null => {
	const forwarded = request.headers.get('x-forwarded-for')
	if (forwarded) {
		const first = forwarded.split(',')[0]?.trim()
		if (first && isIpLike(first)) {
			return first
		}
	}

	const realIp = request.headers.get('x-real-ip')?.trim()
	if (realIp && isIpLike(realIp)) {
		return realIp
	}

	return null
}
