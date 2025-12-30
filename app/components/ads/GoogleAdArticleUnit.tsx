'use client'

import { GoogleAdsenseUnit } from './GoogleAdsenseUnit'

/**
 * In-article Google AdSense unit
 * Displays fluid ads within article content
 */
export interface GoogleAdArticleUnitProps {
	/** Custom CSS classes to apply to the ad wrapper */
	customClasses?: string
}

export const GoogleAdArticleUnit = ({ customClasses = '' }: GoogleAdArticleUnitProps) => {
	return (
		<GoogleAdsenseUnit
			adClient="ca-pub-6902354361648358"
			adSlot="1567881814"
			adFormat="fluid"
			fullWidthResponsive={true}
			className={`text-center ${customClasses}`}
			dataAttributes={{
				'ad-layout': 'in-article',
			}}
		/>
	)
}
