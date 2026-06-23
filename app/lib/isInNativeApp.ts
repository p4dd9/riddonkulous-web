/**
 * True when the page runs inside the riddonkulous-mobile Capacitor shell
 * (Android / iOS WebView). False in a plain browser or during SSR.
 *
 * Uses a cached dynamic import of `@capacitor/core` so nothing touches the
 * native bridge during SSR (same pattern as NativeBridge).
 */

let cached: boolean | null = null
let pending: Promise<boolean> | null = null

export const isInNativeApp = (): Promise<boolean> => {
	if (cached !== null) return Promise.resolve(cached)
	if (pending) return pending

	pending = (async () => {
		if (typeof window === 'undefined') return false
		const { Capacitor } = await import('@capacitor/core')
		cached = Capacitor.isNativePlatform()
		return cached
	})()

	return pending
}
