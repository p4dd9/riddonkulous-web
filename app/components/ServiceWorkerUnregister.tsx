'use client'

import { useEffect } from 'react'

/**
 * Component to unregister any existing service workers
 * This ensures old PWA service workers are removed
 */
export const ServiceWorkerUnregister = () => {
	useEffect(() => {
		if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
			return
		}

		const unregisterServiceWorkers = async () => {
			try {
				// Get all service worker registrations
				const registrations = await navigator.serviceWorker.getRegistrations()

				// Unregister all of them
				for (const registration of registrations) {
					const success = await registration.unregister()
					if (success) {
						console.log('Service worker unregistered successfully:', registration.scope)
					}
				}

				// Clear all caches
				if ('caches' in window) {
					const cacheNames = await caches.keys()
					await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
					console.log('All caches cleared')
				}
			} catch (error) {
				console.error('Error unregistering service workers:', error)
			}
		}

		unregisterServiceWorkers()
	}, [])

	return null
}
