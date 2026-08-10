/**
 * Sends the user to the Play Store listing so they can rate the app.
 *
 * Why `market://` and not the https listing URL: the native shell
 * (riddonkulous-mobile) allow-lists `*.google.com` in `capacitor.config.ts`
 * to keep Google sign-in inside the WebView. `play.google.com` matches that
 * mask, so Capacitor treats an https store link as in-app navigation and
 * renders the store as a web page *inside* the app instead of handing it to
 * the Play Store. `market://` has no allow-listed host, so Capacitor fires an
 * ACTION_VIEW intent and Android opens the Play Store app on our listing.
 *
 * For the same reason this must be a `location.href` assignment and not an
 * `<a target="_blank">` — MainActivity overrides `onCreateWindow` to trap
 * `window.open()` in a chromeless fullscreen dialog (built for the OAuth
 * popup), which a store page would never close.
 */

const MARKET_URL = 'market://details?id=com.riddonkulous.app'

/**
 * True only inside the Android app. The rating prompt is Android-only: the web
 * already pitches installation via AppInstallBanner, and `market://` is
 * meaningless on iOS (there is no App Store listing yet).
 */
export const canRateApp = async (): Promise<boolean> => {
	if (typeof window === 'undefined') return false
	try {
		const { Capacitor } = await import('@capacitor/core')
		return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
	} catch {
		return false
	}
}

export const openAppRating = async (): Promise<void> => {
	if (!(await canRateApp())) return
	// If the Play Store is missing (bare emulator) Capacitor swallows the
	// ActivityNotFoundException and the page simply stays put.
	window.location.href = MARKET_URL
}
