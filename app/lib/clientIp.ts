import type { NextRequest } from 'next/server'

const isIpLike = (value: string) => {
	// Accept IPv4 and IPv6 literals; Traefik may forward either.
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) {
		return true
	}
	if (value.includes(':')) {
		return true
	}
	return false
}

/**
 * Resolve the client IP from reverse-proxy headers.
 * Prefers the first hop in X-Forwarded-For, then X-Real-IP.
 * Returns null when nothing usable is present (caller should fail open).
 */
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
