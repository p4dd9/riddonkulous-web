'use client'

import { useEffect, useState } from 'react'

declare global {
	interface Window {
		adsbygoogle?: Array<Record<string, unknown>>
	}
}

export const GoogleAdDisplayUnitHorizontal = () => {
	const [adLoaded, setAdLoaded] = useState(false)

	useEffect(() => {
		try {
			;(window.adsbygoogle = window.adsbygoogle || []).push({})

			// Check if ad loads after a delay
			const checkAdLoad = setTimeout(() => {
				const adElement = document.querySelector('.adsbygoogle')
				if (adElement && adElement.children.length > 0) {
					setAdLoaded(true)
				}
			}, 1000)

			return () => clearTimeout(checkAdLoad)
		} catch (err) {
			console.error('Error loading ad:', err)
		}
	}, [])

	return (
		<>
			<style>{`
				.google-ad-horizontal-wrapper {
					display: none;
				}
				
				@media (min-width: 728px) {
					.google-ad-horizontal-wrapper {
						display: flex;
					}
				}
				
				.google-ad-horizontal-container {
					width: 728px;
					height: 75px;
				}
				
				.google-ad-horizontal-container .adsbygoogle {
					display: block;
					width: 728px;
					height: 75px;
				}
			`}</style>
			<div className="google-ad-horizontal-wrapper w-full h-[75px] flex justify-center items-center mt-[-32px]">
				<div className="google-ad-horizontal-container bg-[var(--color-bg)] flex items-center justify-center relative">
					{!adLoaded && (
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-xs text-gray-500">Advertisement</span>
						</div>
					)}
					<ins
						className="adsbygoogle"
						style={{ display: 'block' }}
						data-ad-client="ca-pub-6902354361648358"
						data-ad-slot="4750207295"
						data-ad-format="horizontal"
						data-full-width-responsive="true"
					/>
				</div>
			</div>
		</>
	)
}
