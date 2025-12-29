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
		<div className="w-full h-[75px] flex justify-center items-center mt-[-32px]">
			<div
				className="bg-[var(--color-bg)] flex items-center justify-center relative"
				style={{ width: '728px', height: '75px' }}
			>
				{!adLoaded && (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-xs text-gray-500">Advertisement</span>
					</div>
				)}
				<span className="text-sm" style={{ color: '#0B1416' }}>
					Advertisement
				</span>
				<ins
					className="adsbygoogle absolute"
					style={{ display: 'inline-block', width: '728px', height: '75px' }}
					data-ad-client="ca-pub-6902354361648358"
					data-ad-slot="4750207295"
				/>
			</div>
		</div>
	)
}
