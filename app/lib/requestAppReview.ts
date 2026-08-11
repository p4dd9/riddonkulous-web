/**
 * Asks the user to rate the app.
 *
 * Preferred path is Google Play's In-App Review API, which renders the rating
 * card over the app without navigating away. It requires the native plugin to
 * be present in the riddonkulous-mobile build; when it isn't (older installs
 * that predate the plugin, or any non-Android platform) `requestReview()`
 * rejects with `unimplemented` and we fall back to the store listing.
 *
 * The fallback uses `market://` + a `location.href` assignment: the scheme
 * matches no in-app navigation mask, so Capacitor fires an ACTION_VIEW intent
 * and Android opens the Play Store app directly on our listing instead of
 * rendering the store as a web page inside the WebView.
 */

const MARKET_URL = 'market://details?id=com.riddonkulous.app'

/**
 * - `in-app`  the Play rating card was requested; nothing further to show
 * - `store`   In-App Review is unavailable; caller should offer the store link
 * - `unavailable` not an Android app install; ask for nothing
 */
export type ReviewOutcome = 'in-app' | 'store' | 'unavailable'

/**
 * True only inside the Android app. Rating prompts are Android-only: the web
 * already pitches installation via AppInstallBanner, and there is no iOS
 * listing to rate.
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

/**
 * Send the user to the Play Store listing. Only used as the In-App Review
 * fallback — see the module comment for why it's `market://` + `location.href`.
 *
 * If the Play Store is missing (bare emulator) Capacitor swallows the
 * ActivityNotFoundException and the page simply stays put.
 */
export const openStoreListing = (): void => {
	window.location.href = MARKET_URL
}

/**
 * Request a review, preferring the in-app card.
 *
 * Note that Play gives no signal about what the user did — `requestReview()`
 * resolves identically whether the card was shown, dismissed, or silently
 * suppressed because the account is over its (undocumented, roughly a handful
 * per year) quota. So a resolved promise means "we asked", never "they rated",
 * and callers must not treat it as confirmation.
 */
export const requestAppReview = async (): Promise<ReviewOutcome> => {
	if (!(await canRateApp())) return 'unavailable'

	try {
		const { InAppReview } = await import('@capacitor-community/in-app-review')
		await InAppReview.requestReview()
		return 'in-app'
	} catch {
		// Plugin absent from this build, or the Play flow failed outright.
		return 'store'
	}
}
