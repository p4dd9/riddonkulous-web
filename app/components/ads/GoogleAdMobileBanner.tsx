'use client'

import { GoogleAdsenseUnit } from './GoogleAdsenseUnit'

/**
 * Mobile banner Google AdSense unit (300x50)
 * Displays only on mobile devices (screens narrower than 768px)
 */
export interface GoogleAdMobileBannerProps {
	/** Custom CSS classes to apply to the ad wrapper */
	customClasses?: string
}

export const GoogleAdMobileBanner = ({ customClasses = '' }: GoogleAdMobileBannerProps) => {
	return (
		<GoogleAdsenseUnit
			adClient="ca-pub-6902354361648358"
			adSlot="1848256874"
			width={300}
			height={50}
			fullWidthResponsive={false}
			className={`md:hidden ${customClasses}`}
		/>
	)
}
