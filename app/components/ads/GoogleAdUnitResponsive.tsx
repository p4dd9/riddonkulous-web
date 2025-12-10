'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

declare global {
	interface Window {
		adsbygoogle?: Array<Record<string, unknown>>
	}
}

export const GoogleAdDisplayUnitResponsive = () => {
	const adInitialized = useRef(false)
	const adElementRef = useRef<HTMLModElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const initializeAd = () => {
		if (adInitialized.current) return

		if (typeof window === 'undefined' || !window.adsbygoogle || !adElementRef.current || !containerRef.current) {
			return false
		}

		// Check if ad is already initialized
		if (adElementRef.current.hasAttribute('data-adsbygoogle-status')) {
			adInitialized.current = true
			return true
		}

		// Ensure container has width
		if (containerRef.current.offsetWidth === 0) {
			return false
		}

		try {
			;(window.adsbygoogle = window.adsbygoogle || []).push({})
			adInitialized.current = true
			return true
		} catch (err) {
			console.error('Error loading ad:', err)
			return false
		}
	}

	useEffect(() => {
		const checkAndInit = () => {
			if (!initializeAd()) {
				setTimeout(checkAndInit, 100)
			}
		}

		// Start checking after DOM is ready
		const timeoutId = setTimeout(checkAndInit, 200)

		return () => {
			clearTimeout(timeoutId)
		}
	}, [])

	const handleScriptLoad = () => {
		if (!adInitialized.current) {
			setTimeout(() => {
				initializeAd()
			}, 100)
		}
	}

	return (
		<>
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6902354361648358"
				crossOrigin="anonymous"
				strategy="afterInteractive"
				onLoad={handleScriptLoad}
			/>
			<div
				ref={containerRef}
				style={{
					minWidth: '120px',
					minHeight: '100px', // Reserve space to prevent reflow on mobile
					maxWidth: '1200px',
					maxHeight: '1200px',
					// Prevent layout shift during ad load
					position: 'relative',
				}}
			>
				<ins
					ref={adElementRef}
					className="adsbygoogle"
					style={{
						display: 'block',
						width: '100%',
						minWidth: '120px',
						minHeight: '50px',
						maxWidth: '1200px',
						maxHeight: '1200px',
						// Prevent reflow by ensuring the element maintains space
						verticalAlign: 'bottom',
					}}
					data-ad-client="ca-pub-6902354361648358"
					data-ad-slot="4750207295"
					data-ad-format="auto"
					data-full-width-responsive="true"
				/>
			</div>
		</>
	)
}
