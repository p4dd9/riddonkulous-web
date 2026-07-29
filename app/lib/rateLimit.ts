type RateLimitEntry = {
	count: number
	windowStart: number
}

type RateLimitResult = {
	allowed: boolean
	count: number
	retryAfterSec: number
}

const store = new Map<string, RateLimitEntry>()

const pruneExpired = (now: number, windowMs: number) => {
	for (const [key, entry] of store) {
		if (now - entry.windowStart >= windowMs) {
			store.delete(key)
		}
	}
}

/**
 * Sliding fixed-window in-memory rate limiter (per process).
 * Suitable for a single Next.js container behind Traefik.
 */
export const checkRateLimit = (
	key: string,
	max: number,
	windowMs: number,
	now = Date.now()
): RateLimitResult => {
	// Opportunistic prune so the map does not grow without bound
	if (store.size > 1000) {
		pruneExpired(now, windowMs)
	}

	const entry = store.get(key)

	if (!entry || now - entry.windowStart >= windowMs) {
		store.set(key, { count: 1, windowStart: now })
		return { allowed: true, count: 1, retryAfterSec: Math.ceil(windowMs / 1000) }
	}

	entry.count += 1
	const elapsed = now - entry.windowStart
	const retryAfterSec = Math.max(1, Math.ceil((windowMs - elapsed) / 1000))

	if (entry.count > max) {
		return { allowed: false, count: entry.count, retryAfterSec }
	}

	return { allowed: true, count: entry.count, retryAfterSec }
}

/** Test helper — clears the in-memory store. */
export const resetRateLimitStore = () => {
	store.clear()
}
