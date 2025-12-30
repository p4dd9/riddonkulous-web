'use client'

import { GoogleAdsenseUnit } from './GoogleAdsenseUnit'

/**
 * Horizontal Google AdSense unit (728x90)
 * Displays only on screens wider than 728px
 */
export const GoogleAdDisplayUnitHorizontal = () => {
	return (
		<GoogleAdsenseUnit
			adClient="ca-pub-6902354361648358"
			adSlot="4750207295"
			adFormat="horizontal"
			width={728}
			height={90}
			fullWidthResponsive={true}
			minBreakpoint={728}
			marginTop="-32px"
			marginBottom="32px"
		/>
	)
}
