import { cookies, headers } from 'next/headers'

// The riddonkulous-mobile Capacitor app appends this token to its WebView
// User-Agent (top-level `appendUserAgent` in capacitor.config.ts). The app is
// guest-only: when this token is present we render without any login/create
// UI and ignore session cookies. Match the token, not the version, so app
// version bumps need no change here.
export const NATIVE_APP_UA_TOKEN = 'RiddonkulousApp'

// Local debugging: force the "app" or "web" view without a native shell.
// Set via the ViewSwitcher pill or `?view=app|web|auto`. Only honoured when
// the switcher is enabled (dev server, or VIEW_SWITCHER_ENABLED=true).
export const VIEW_OVERRIDE_COOKIE = 'riddonkulous_view'

export type ViewOverride = 'app' | 'web'

export const isViewSwitcherEnabled = (): boolean =>
	process.env.NODE_ENV !== 'production' || process.env.VIEW_SWITCHER_ENABLED === 'true'

export const parseViewOverride = (value: string | null | undefined): ViewOverride | null =>
	value === 'app' || value === 'web' ? value : null

export const isNativeAppUserAgent = (userAgent: string | null): boolean => !!userAgent?.includes(NATIVE_APP_UA_TOKEN)

/** Native-app detection that respects the debug override cookie. */
export const resolveIsNativeApp = (userAgent: string | null, overrideCookie: string | null | undefined): boolean => {
	const override = isViewSwitcherEnabled() ? parseViewOverride(overrideCookie) : null
	if (override) return override === 'app'
	return isNativeAppUserAgent(userAgent)
}

export const getViewOverrideRequest = async (): Promise<ViewOverride | null> =>
	isViewSwitcherEnabled() ? parseViewOverride((await cookies()).get(VIEW_OVERRIDE_COOKIE)?.value) : null

export const isNativeAppRequest = async (): Promise<boolean> =>
	resolveIsNativeApp((await headers()).get('user-agent'), (await cookies()).get(VIEW_OVERRIDE_COOKIE)?.value)

// Gameplay (solving riddles, adventures, browsing to play) lives in the native
// apps only. Browsers get teaser pages that point to the stores, unless
// WEB_PLAY_ENABLED=true switches web play back on.
export const isWebPlayEnabled = (): boolean => process.env.WEB_PLAY_ENABLED === 'true'

export const canPlayRequest = async (): Promise<boolean> => isWebPlayEnabled() || (await isNativeAppRequest())
