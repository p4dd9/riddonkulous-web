/**
 * Client-side PWA utility functions
 */

export const DISMISSED_KEY = 'pwa-install-dismissed'
export const DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Check if user is on iOS device (client-side)
 */
export const isIOSDevice = (userAgent?: string): boolean => {
	if (typeof window === 'undefined') {
		// Server-side: use provided userAgent or return false
		if (userAgent) {
			return /iPad|iPhone|iPod/.test(userAgent) && !/MSStream/.test(userAgent)
		}
		return false
	}
	// Client-side: use navigator
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream
}

/**
 * Check if user is on desktop Chrome or Edge (client-side)
 */
export const isDesktopChromeOrEdge = (userAgent?: string): boolean => {
	if (typeof window === 'undefined') {
		// Server-side: use provided userAgent
		if (userAgent) {
			const isChrome = /Chrome/.test(userAgent) && !/Edg/.test(userAgent)
			const isEdge = /Edg/.test(userAgent)
			const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
			return (isChrome || isEdge) && !isMobile
		}
		return false
	}
	// Client-side: use navigator
	const ua = navigator.userAgent
	const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua)
	const isEdge = /Edg/.test(ua)
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
	return (isChrome || isEdge) && !isMobile
}

/**
 * Check if PWA is already installed
 */
export const isPWAInstalled = (): boolean => {
	if (typeof window === 'undefined') return false
	return window.matchMedia('(display-mode: standalone)').matches
}

/**
 * Check if user previously dismissed the install prompt
 */
export const wasPromptDismissed = (): boolean => {
	if (typeof window === 'undefined') return false
	const dismissed = localStorage.getItem(DISMISSED_KEY)
	if (!dismissed) return false
	const dismissedTime = parseInt(dismissed, 10)
	const now = Date.now()
	return now - dismissedTime < DISMISSED_DURATION
}

/**
 * Save dismissal timestamp
 */
export const saveDismissal = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(DISMISSED_KEY, Date.now().toString())
	}
}

/**
 * Clear dismissal (when app is installed)
 */
export const clearDismissal = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(DISMISSED_KEY)
	}
}
