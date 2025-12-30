// Service Worker for Riddonkulous PWA
// This service worker is required for PWA installation on Chrome/Edge

const CACHE_NAME = 'riddonkulous-v1'
const urlsToCache = ['/', '/riddle-feed', '/web-app-manifest-192x192.png', '/web-app-manifest-512x512.png']

// Install event - cache resources
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache)
			})
			.catch((error) => {
				console.error('Service Worker install error:', error)
			})
	)
	// Activate immediately
	self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
	// Take control of all pages immediately
	return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url)

	// Skip caching for:
	// - Cross-origin requests (external domains)
	// - Google AdSense scripts
	// - Analytics scripts
	// - OAuth scripts
	// - API requests
	const isExternal = url.origin !== self.location.origin
	const isAdScript = url.href.includes('adsbygoogle.js')
	const isAnalytics = url.href.includes('plausible') || url.href.includes('analytics')
	const isOAuth = url.href.includes('accounts.google.com')
	const isAPI = url.pathname.startsWith('/api/')

	if (isExternal || isAdScript || isAnalytics || isOAuth || isAPI) {
		// For external requests, don't intercept - let browser handle normally
		// This prevents service worker from trying to cache cross-origin requests
		return
	}

	// Only intercept same-origin requests for caching
	event.respondWith(
		caches.match(event.request).then((response) => {
			// Return cached version or fetch from network
			return response || fetch(event.request)
		})
	)
})
