import { headers } from 'next/headers'

/**
 * Server-side PWA utility functions
 * These functions can be used in Server Components and API routes
 */

/**
 * Get user agent from request headers (server-side)
 */
export const getUserAgent = async (): Promise<string> => {
	const headersList = await headers()
	return headersList.get('user-agent') || ''
}

/**
 * Check if user is on iOS device (server-side)
 */
export const isIOSDeviceServer = async (): Promise<boolean> => {
	const ua = await getUserAgent()
	return /iPad|iPhone|iPod/.test(ua) && !/MSStream/.test(ua)
}

/**
 * Check if user is on desktop Chrome or Edge (server-side)
 */
export const isDesktopChromeOrEdgeServer = async (): Promise<boolean> => {
	const ua = await getUserAgent()
	const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua)
	const isEdge = /Edg/.test(ua)
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
	return (isChrome || isEdge) && !isMobile
}

/**
 * Get device/browser info (server-side)
 */
export const getDeviceInfo = async () => {
	const ua = await getUserAgent()
	return {
		userAgent: ua,
		isIOS: await isIOSDeviceServer(),
		isDesktopChromeOrEdge: await isDesktopChromeOrEdgeServer(),
	}
}
