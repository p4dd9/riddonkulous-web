'use client'

import { useEffect, useState } from 'react'

/**
 * Debug component to help diagnose PWA installability issues
 * Remove this component once everything is working
 */
export const PWADebugInfo = () => {
	const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({})

	useEffect(() => {
		if (typeof window === 'undefined') return

		const checkInstallability = async () => {
			const info: Record<string, unknown> = {
				userAgent: navigator.userAgent,
				serviceWorkerSupported: 'serviceWorker' in navigator,
				isStandalone: window.matchMedia('(display-mode: standalone)').matches,
				manifestLink: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
			}

			// Check service worker registration
			if ('serviceWorker' in navigator) {
				try {
					const registration = await navigator.serviceWorker.getRegistration()
					info.serviceWorkerRegistered = !!registration
					info.serviceWorkerScope = registration?.scope
					info.serviceWorkerActive = !!registration?.active
				} catch (error) {
					info.serviceWorkerError = String(error)
				}
			}

			// Check manifest
			try {
				const manifestResponse = await fetch('/manifest')
				info.manifestAccessible = manifestResponse.ok
				info.manifestStatus = manifestResponse.status
				if (manifestResponse.ok) {
					const manifest = await manifestResponse.json()
					info.manifestName = manifest.name
					info.manifestStartUrl = manifest.start_url
					info.manifestDisplay = manifest.display
					info.manifestIcons = manifest.icons?.length || 0
					info.manifestHasAnyIcon = manifest.icons?.some((icon: { purpose?: string }) => 
						!icon.purpose || icon.purpose === 'any' || icon.purpose.includes('any')
					)
					info.manifestHas192Icon = manifest.icons?.some((icon: { sizes?: string }) => 
						icon.sizes?.includes('192')
					)
					info.manifestHas512Icon = manifest.icons?.some((icon: { sizes?: string }) => 
						icon.sizes?.includes('512')
					)
					
					// Check if icons are accessible
					if (manifest.icons) {
						const iconChecks = await Promise.all(
							manifest.icons.map(async (icon: { src?: string }) => {
								if (!icon.src) return { src: 'missing', accessible: false }
								try {
									const iconResponse = await fetch(icon.src)
									return { src: icon.src, accessible: iconResponse.ok, status: iconResponse.status }
								} catch {
									return { src: icon.src, accessible: false }
								}
							})
						)
						info.iconAccessibility = iconChecks
					}
				}
			} catch (error) {
				info.manifestError = String(error)
			}

			// Check service worker file
			try {
				const swResponse = await fetch('/sw.js')
				info.serviceWorkerFileAccessible = swResponse.ok
				info.serviceWorkerFileStatus = swResponse.status
			} catch (error) {
				info.serviceWorkerFileError = String(error)
			}

			setDebugInfo(info)
		}

		checkInstallability()
	}, [])

	// Only show in development
	if (process.env.NODE_ENV === 'production') {
		return null
	}

	return (
		<div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md z-50 overflow-auto max-h-96">
			<h3 className="font-bold mb-2">PWA Debug Info</h3>
			<pre className="whitespace-pre-wrap break-words">{JSON.stringify(debugInfo, null, 2)}</pre>
		</div>
	)
}

