/**
 * Client-side UA sniffing for the platform-specific install banners
 * (AppInstallBanner for Android, AppInstallBannerIOS for iOS/macOS Safari).
 */

export const isAndroidUserAgent = (userAgent: string): boolean => /android/i.test(userAgent)

/**
 * True for Safari on iOS, iPadOS, and macOS. Excludes other browsers that
 * include "Safari" in their UA string (Chrome, Firefox, Edge — including
 * their iOS variants, which are still WebKit but aren't Safari) and excludes
 * Android, where Chrome's UA also contains "Safari".
 */
export const isSafariUserAgent = (userAgent: string): boolean =>
	/safari/i.test(userAgent) && !/chrome|chromium|crios|fxios|edgios|android/i.test(userAgent)
