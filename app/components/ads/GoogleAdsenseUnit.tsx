'use client'

import { useEffect, useId, useState } from 'react'

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

	useEffect(() => {
		let checkAdLoadTimer: NodeJS.Timeout
		let retryTimer: NodeJS.Timeout
		let retryCount = 0
		const MAX_RETRIES = 20 // Max 2 seconds of retries (20 * 100ms)

		const initializeAd = () => {
			try {
				// For in-article ads, ensure container has width before initializing
				if (isInArticle) {
					const container = document.getElementById(containerId)
					if (!container) {
						// Container not in DOM yet, retry
						if (retryCount < MAX_RETRIES) {
							retryCount++
							retryTimer = setTimeout(initializeAd, 100)
							return
						}
						// Max retries reached, initialize anyway
					} else {
						const containerWidth = container.offsetWidth || container.clientWidth
						if (containerWidth === 0 && retryCount < MAX_RETRIES) {
							// Container has no width yet, retry after a short delay
							retryCount++
							retryTimer = setTimeout(initializeAd, 100)
							return
						}
					}
				}

				;(window.adsbygoogle = window.adsbygoogle || []).push({})

				// Check if ad loads after a delay
				checkAdLoadTimer = setTimeout(() => {
					const adElement = document.querySelector(`#${containerId} .adsbygoogle`)
					if (adElement && adElement.children.length > 0) {
						setAdLoaded(true)
					}
					// If ad still hasn't loaded after timeout, keep placeholder visible
					// (This handles localhost/development where ads won't load)
				}, 2000)
			} catch (err) {
				console.error('Error loading ad:', err)
			}
		}

		// For in-article ads, wait a bit for layout to settle
		if (isInArticle) {
			const initialTimer = setTimeout(initializeAd, 200)
			return () => {
				clearTimeout(initialTimer)
				clearTimeout(retryTimer)
				clearTimeout(checkAdLoadTimer)
			}
		} else {
			initializeAd()
			return () => {
				clearTimeout(retryTimer)
				clearTimeout(checkAdLoadTimer)
			}
		}
	}, [containerId, isInArticle])

	// Build inline styles for the container
	const containerStyle: React.CSSProperties = {
		...(width && { width: `${width}px` }),
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
					${width ? `width: ${width}px !important; max-width: ${width}px !important;` : ''}
					${height ? `height: ${height}px !important; max-height: ${height}px !important;` : ''}
					${isInArticle && !width ? `min-width: 1px; width: 100%;` : ''}
					${!height ? `min-height: 50px;` : ''}
					overflow: hidden;
				}
				
				#${containerId} .adsbygoogle {
					display: block;
					${width ? `width: ${width}px !important; max-width: ${width}px !important; min-width: ${width}px !important;` : ''}
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
