'use client'

import { useEffect } from 'react'

declare global {
	interface Window {
		adsbygoogle?: Array<Record<string, unknown>>
	}
}

export const GoogleAdDisplayUnit = () => {
	useEffect(() => {
		try {
			;(window.adsbygoogle = window.adsbygoogle || []).push({})
		} catch (err) {
			console.error('Error loading ad:', err)
		}
	}, [])

	return (
		<div className="w-full h-[90px]">
			<ins
				className="adsbygoogle"
				style={{ display: 'inline-block', width: '728px', height: '90px' }}
				data-ad-client="ca-pub-6902354361648358"
				data-ad-slot="4750207295"
			/>
		</div>
	)
}
