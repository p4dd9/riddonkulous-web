'use client'

import { GoogleAdSquare120 } from './GoogleAdSquare120'
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
				
				.ad-category-grid-120 {
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
				
				/* Show 120x120 for screens >= 330px and < 485px */
				@media (min-width: 330px) and (max-width: 484px) {
					.ad-category-grid-120 {
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
			{/* 120x120 ad for smaller screens */}
			<div className="ad-category-grid-120 items-center justify-center aspect-square w-full rounded-lg border-2 border-gray-500/50 overflow-hidden">
				<GoogleAdSquare120 />
			</div>
		</>
	)
}

