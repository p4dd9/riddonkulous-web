'use client'

import { GoogleAdsenseUnit } from './GoogleAdsenseUnit'

/**
 * In-feed Google AdSense unit
 * Displays fluid ads within feed content
 */
export interface GoogleAdInFeedUnitProps {
	/** Custom CSS classes to apply to the ad wrapper */
	customClasses?: string
}

export const GoogleAdInFeedUnit = ({ customClasses = '' }: GoogleAdInFeedUnitProps) => {
	return (
		<GoogleAdsenseUnit
			adClient="ca-pub-6902354361648358"
			adSlot="1031683434"
			adFormat="fluid"
			fullWidthResponsive={true}
			minHeight={50}
			className={`${customClasses}`}
			dataAttributes={{
				'ad-layout-key': '-eb+6l-2v-aq+u1',
			}}
		/>
	)
}

