'use client'

import { GoogleAdSquare200 } from './GoogleAdSquare200'
import { GoogleAdSquare250 } from './GoogleAdSquare250'

export const GoogleAdCategoryGrid = () => {
	return (
		<>
			<style>{`
				.ad-category-grid-250 {
					display: none;
				}
				
				.ad-category-grid-200 {
					display: none;
				}
				
				/* Show 250x250 for screens >= 870px */
				@media (min-width: 870px) {
					.ad-category-grid-250 {
						display: flex;
					}
				}
				
				/* Show 200x200 for screens >= 485px and < 870px */
				@media (min-width: 485px) and (max-width: 869px) {
					.ad-category-grid-200 {
						display: flex;
					}
				}
			`}</style>
			{/* 250x250 ad for larger screens */}
			<div className="ad-category-grid-250 items-center justify-center aspect-square w-full rounded-lg border-2 border-gray-500/50 overflow-hidden">
				<GoogleAdSquare250 />
			</div>
			{/* 200x200 ad for medium screens */}
			<div className="ad-category-grid-200 items-center justify-center aspect-square w-full rounded-lg border-2 border-gray-500/50 overflow-hidden">
				<GoogleAdSquare200 />
			</div>
		</>
	)
}

