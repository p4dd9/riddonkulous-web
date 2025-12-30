// Service Worker Uninstall Script
// This service worker unregisters itself immediately

self.addEventListener('install', () => {
	// Skip waiting and activate immediately
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	// Clear all caches
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					return caches.delete(cacheName)
				})
			)
		}).then(() => {
			// Unregister this service worker
			return self.registration.unregister()
		})
	)
})

// Don't handle any fetch events
self.addEventListener('fetch', () => {
	// Do nothing - let requests go through normally
})

