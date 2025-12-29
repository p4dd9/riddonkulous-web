'use client'

import { useEffect } from 'react'

/**
 * Client component to register the service worker
 * Required for PWA installation on Chrome/Edge browsers
 */
export const ServiceWorkerRegistration = () => {
	useEffect(() => {
		if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
			return
		}

		const registerSW = async () => {
			try {
				const registration = await navigator.serviceWorker.register('/sw.js', {
					scope: '/',
				})

				// Handle service worker state
				if (registration.installing) {
					registration.installing.addEventListener('statechange', () => {
						if (registration.installing?.state === 'activated') {
							console.log('Service Worker activated')
						}
					})
				} else if (registration.waiting) {
					registration.waiting.postMessage({ type: 'SKIP_WAITING' })
				}

				// Listen for updates
				registration.addEventListener('updatefound', () => {
					console.log('Service Worker update available')
				})
			} catch (error) {
				console.error('Service Worker registration failed:', error)
			}
		}

		// Register immediately if page is loaded, otherwise wait
		if (document.readyState === 'complete') {
			registerSW()
		} else {
			const handler = () => registerSW()
			window.addEventListener('load', handler)
			return () => window.removeEventListener('load', handler)
		}
	}, [])

	return null
}
