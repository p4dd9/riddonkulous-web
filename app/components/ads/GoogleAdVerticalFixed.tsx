'use client'

import { GoogleAdsenseUnit } from './GoogleAdsenseUnit'

export const GoogleAdVerticalFixed = () => {
	return (
		<>
			<style>{`
				.vertical-ad-fixed {
					display: none;
				}
				
				@media (min-width: 1880px) {
					.vertical-ad-fixed {
						display: block;
						position: fixed;
						left: calc(50% + 576px + 2rem);
						top: 13rem;
						z-index: 40;
					}
				}
			`}</style>
			<div className="vertical-ad-fixed">
				<GoogleAdsenseUnit
					adClient="ca-pub-6902354361648358"
					adSlot="7048273358"
					width={300}
					height={600}
					fullWidthResponsive={false}
					adFormat="auto"
				/>
			</div>
		</>
	)
}
