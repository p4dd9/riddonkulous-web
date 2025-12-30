'use client'

import { useId, useLayoutEffect, useState } from 'react'

declare global {
	interface Window {
		adsbygoogle?: Array<Record<string, unknown>>
	}
}

export interface GoogleAdsenseUnitProps {
	/** Google AdSense publisher ID (e.g., "ca-pub-6902354361648358") */
	adClient: string
	/** Google AdSense ad slot ID */
	adSlot: string
	/** Ad format: "auto", "horizontal", "rectangle", "vertical", etc. */
	adFormat?: string
	/** Width of the ad unit in pixels */
	width?: number
	/** Height of the ad unit in pixels */
	height?: number
	/** Enable full-width responsive mode */
	fullWidthResponsive?: boolean
	/** Minimum width for responsive ads */
	minWidth?: number
	/** Maximum width for responsive ads */
	maxWidth?: number
	/** Minimum height for responsive ads */
	minHeight?: number
	/** Maximum height for responsive ads */
	maxHeight?: number
	/** Custom CSS class for the wrapper */
	className?: string
	/** Custom CSS class for the container */
	containerClassName?: string
	/** Show ad only above a certain breakpoint (in pixels) */
	minBreakpoint?: number
	/** Custom margin top */
	marginTop?: string
	/** Custom margin bottom */
	marginBottom?: string
	/** Additional data attributes */
	dataAttributes?: Record<string, string>
}

export const GoogleAdsenseUnit = ({
	adClient,
	adSlot,
	adFormat = 'auto',
	width,
	height,
	fullWidthResponsive = true,
	minWidth,
	maxWidth,
	minHeight,
	maxHeight,
	className = '',
	containerClassName = '',
	minBreakpoint,
	marginTop,
	marginBottom,
	dataAttributes = {},
}: GoogleAdsenseUnitProps) => {
	const [adLoaded, setAdLoaded] = useState(false)
	const uniqueId = useId().replace(/:/g, '-')
	const wrapperId = `google-ad-wrapper-${uniqueId}`
	const containerId = `google-ad-container-${uniqueId}`

	// Check if this is an in-article ad
	const isInArticle =
		dataAttributes['ad-layout'] === 'in-article' || dataAttributes['data-ad-layout'] === 'in-article'

	// Check if this is an in-feed ad
	const isInFeed = !!dataAttributes['ad-layout-key'] || !!dataAttributes['data-ad-layout-key']

	useLayoutEffect(() => {
		const container = document.getElementById(containerId)
		if (!container) return

		// Check if ad element already has content (already initialized)
		const adElement = container.querySelector('.adsbygoogle')
		if (adElement && (adElement as HTMLElement).dataset.adsbygoogleStatus) {
			return // Already initialized
		}

		let resizeObserver: ResizeObserver | null = null
		let intersectionObserver: IntersectionObserver | null = null
		let adInitialized = false
		let checkAdLoadTimer: NodeJS.Timeout | null = null

		// Determine minimum required width for fluid ads
		const minRequiredWidth = fullWidthResponsive && adFormat === 'fluid' ? 250 : 1
		const needsWidthCheck = isInArticle || isInFeed || (fullWidthResponsive && adFormat === 'fluid')

		// Track state
		let hasRequiredWidth = false
		let isVisible = false

		const checkAndInitializeAd = () => {
			// Don't initialize if already done
			if (adInitialized) return

			// Check if ad element already has been marked by AdSense
			const adEl = container.querySelector('.adsbygoogle')
			if (adEl && (adEl as HTMLElement).dataset.adsbygoogleStatus) {
				return // Already processed by AdSense
			}

			// For ads that need width checking, both conditions must be met
			if (needsWidthCheck) {
				if (!hasRequiredWidth || !isVisible) {
					return // Not ready yet
				}
			}

			// Initialize the ad
			try {
				;(window.adsbygoogle = window.adsbygoogle || []).push({})
				adInitialized = true

				// Check if ad loads after a delay
				checkAdLoadTimer = setTimeout(() => {
					const adElement = container.querySelector('.adsbygoogle')
					if (adElement && adElement.children.length > 0) {
						setAdLoaded(true)
					}
				}, 2000)
			} catch (err) {
				console.error('Error loading ad:', err)
			}
		}

		// For ads that need width checking, use ResizeObserver and IntersectionObserver
		if (needsWidthCheck) {
			// Check initial width
			const initialWidth = container.getBoundingClientRect().width
			hasRequiredWidth = initialWidth >= minRequiredWidth

			// Use ResizeObserver to detect when container has proper width
			resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					// Use borderBoxSize for more accurate width
					const width = entry.borderBoxSize?.[0]?.inlineSize || entry.contentRect.width
					const previousState = hasRequiredWidth
					hasRequiredWidth = width >= minRequiredWidth

					// Only check if state changed to true
					if (hasRequiredWidth && !previousState) {
						checkAndInitializeAd()
					}
				}
			})

			// Use IntersectionObserver to ensure container is visible
			intersectionObserver = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						const previousState = isVisible
						isVisible = entry.isIntersecting && entry.intersectionRatio > 0

						// Only check if state changed to true
						if (isVisible && !previousState) {
							checkAndInitializeAd()
						}
					}
				},
				{ threshold: 0.01 }
			)

			resizeObserver.observe(container)
			intersectionObserver.observe(container)

			// If already meets requirements, initialize
			if (hasRequiredWidth) {
				// Check visibility separately
				const rect = container.getBoundingClientRect()
				isVisible = rect.top < window.innerHeight && rect.bottom > 0
				if (isVisible) {
					checkAndInitializeAd()
				}
			}
		} else {
			// For ads that don't need width checking, initialize immediately
			checkAndInitializeAd()
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect()
			}
			if (intersectionObserver) {
				intersectionObserver.disconnect()
			}
			if (checkAdLoadTimer) {
				clearTimeout(checkAdLoadTimer)
			}
		}
	}, [containerId, isInArticle, isInFeed, fullWidthResponsive, adFormat])

	// Build inline styles for the container
	const containerStyle: React.CSSProperties = {
		...(width ? { width: `${width}px` } : { width: '100%' }), // Always set width
		...(height && { height: `${height}px` }),
		...(minWidth && { minWidth: `${minWidth}px` }),
		...(maxWidth && { maxWidth: `${maxWidth}px` }),
		...(minHeight && { minHeight: `${minHeight}px` }),
		...(maxHeight && { maxHeight: `${maxHeight}px` }),
	}

	// Build inline styles for the ad element
	const adStyle: React.CSSProperties = {
		display: 'block',
		...(width && { width: `${width}px` }),
		...(height && { height: `${height}px` }),
		...(minWidth && { minWidth: `${minWidth}px` }),
		...(maxWidth && { maxWidth: `${maxWidth}px` }),
		...(minHeight && { minHeight: `${minHeight}px` }),
		...(maxHeight && { maxHeight: `${maxHeight}px` }),
	}

	const wrapperStyle: React.CSSProperties = {
		...(marginTop && { marginTop }),
		...(marginBottom && { marginBottom }),
	}

	return (
		<>
			<style>{`
				#${wrapperId} {
					${minBreakpoint ? `display: none;` : ''}
				}
				
				${minBreakpoint ? `@media (min-width: ${minBreakpoint}px) {` : ''}
					${minBreakpoint ? `#${wrapperId} { display: flex; }` : ''}
				${minBreakpoint ? `}` : ''}
				
				#${containerId} {
					background-color: var(--color-bg, #0b1416);
					${width ? `width: ${width}px !important; max-width: ${width}px !important;` : 'width: 100% !important;'}
					${height ? `height: ${height}px !important; max-height: ${height}px !important;` : ''}
					min-width: 250px !important;
					${minHeight && !height ? `min-height: ${minHeight}px !important;` : !height && !isInFeed ? `min-height: 50px;` : ''}
					overflow: visible;
				}
				
				#${containerId} .adsbygoogle {
					display: block;
					${width ? `width: ${width}px !important; max-width: ${width}px !important; min-width: ${width}px !important;` : 'width: 100% !important; min-width: 250px !important;'}
					${height ? `height: ${height}px !important; max-height: ${height}px !important; min-height: ${height}px !important;` : ''}
				}
				
				${
					width && height && !fullWidthResponsive
						? `
					#${containerId} .adsbygoogle,
					#${containerId} .adsbygoogle > div,
					#${containerId} .adsbygoogle > div > div,
					#${containerId} .adsbygoogle iframe,
					#${containerId} .adsbygoogle [id^="aswift_"],
					#${containerId} .adsbygoogle [id^="aswift_"] iframe {
						width: ${width}px !important;
						height: ${height}px !important;
						max-width: ${width}px !important;
						max-height: ${height}px !important;
						min-width: ${width}px !important;
						min-height: ${height}px !important;
					}
					#${containerId} {
						overflow: hidden !important;
					}
				`
						: ''
				}
			`}</style>
			<div id={wrapperId} className={`w-full flex justify-center items-center ${className}`} style={wrapperStyle}>
				<div
					id={containerId}
					className={`flex items-center justify-center relative ${containerClassName}`}
					style={containerStyle}
				>
					{!adLoaded && (
						<div className="absolute inset-0 flex items-center justify-center min-h-[50px] w-full z-10">
							<span className="text-xs text-gray-500">Advertisement</span>
						</div>
					)}
					<ins
						className="adsbygoogle"
						style={adStyle}
						data-ad-client={adClient}
						data-ad-slot={adSlot}
						{...(adFormat && fullWidthResponsive
							? ({ 'data-ad-format': adFormat } as React.HTMLAttributes<HTMLElement>)
							: {})}
						{...(fullWidthResponsive
							? ({ 'data-full-width-responsive': 'true' } as React.HTMLAttributes<HTMLElement>)
							: {})}
						{...(Object.keys(dataAttributes).length > 0
							? (Object.fromEntries(
									Object.entries(dataAttributes).map(([key, value]) => [
										key.startsWith('data-') ? key : `data-${key}`,
										value,
									])
								) as React.HTMLAttributes<HTMLElement>)
							: {})}
					/>
				</div>
			</div>
		</>
	)
}
