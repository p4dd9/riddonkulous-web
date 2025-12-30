'use client'

import { GoogleAdsenseUnit } from './GoogleAdsenseUnit'

/**
 * Mobile banner Google AdSense unit (300x50)
 * Displays only on mobile devices (screens narrower than 768px)
 */
export const GoogleAdMobileBanner = () => {
	return (
		<GoogleAdsenseUnit
			adClient="ca-pub-6902354361648358"
			adSlot="1848256874"
			adFormat="horizontal"
			width={300}
			height={50}
			fullWidthResponsive={false}
			className="md:hidden mt-[-32px] mb-2"
		/>
	)
}
