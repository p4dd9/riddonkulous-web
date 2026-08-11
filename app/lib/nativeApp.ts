import { headers } from 'next/headers'

// The riddonkulous-mobile Capacitor app appends this token to its WebView
// User-Agent (top-level `appendUserAgent` in capacitor.config.ts). The app is
// guest-only: when this token is present we render without any login/create
// UI and ignore session cookies. Match the token, not the version, so app
// version bumps need no change here.
export const NATIVE_APP_UA_TOKEN = 'RiddonkulousApp'

export const isNativeAppUserAgent = (userAgent: string | null): boolean =>
	!!userAgent?.includes(NATIVE_APP_UA_TOKEN)

export const isNativeAppRequest = async (): Promise<boolean> =>
	isNativeAppUserAgent((await headers()).get('user-agent'))
