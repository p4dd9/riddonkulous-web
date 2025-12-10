'use client'

import { useEffect } from 'react'

declare global {
	interface Window {
		adsbygoogle?: Array<Record<string, unknown>>
	}
}

export const GoogleAdDisplayUnitResponsive = () => {
	useEffect(() => {
		try {
			;(window.adsbygoogle = window.adsbygoogle || []).push({})
		} catch (err) {
			console.error('Error loading ad:', err)
		}
	}, [])

	return (
		<div className="w-full flex justify-center items-center">
			<div
				className="bg-(--color-bg-dark) flex items-center justify-center relative"
				style={{ width: '300px', height: '250px' }}
			>
				<span className="text-sm" style={{ color: '#0B1416' }}>
					Advertisement
				</span>
				<ins
					className="adsbygoogle absolute"
					style={{ display: 'inline-block', width: '300px', height: '250px' }}
					data-ad-client="ca-pub-6902354361648358"
					data-ad-slot="4750207295"
				/>
			</div>
		</div>
	)
}

