'use client'

import { GoogleAdInFeedUnit } from '@/app/components/ads/GoogleAdInFeedUnit'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { NothingMoreToLoad } from '@/app/components/NothingMoreToLoad'
import { RiddleAuthorHeader } from '@/app/components/riddles/RiddleAuthorHeader'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import type { PaginatedRiddlesDataType } from '@/app/schemas/PaginatedRiddlesResponse'
import { formatDate } from '@/app/util/format'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export default function RiddleFeedPage() {
	const [riddles, setRiddles] = useState<DailyRiddleType[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [offset, setOffset] = useState(0)

	const LIMIT = 5

	const fetchRiddles = useCallback(
		async (currentOffset: number) => {
			if (isLoading) return

			setIsLoading(true)

			try {
				const response = await fetch(`/api/riddles/feed?limit=${LIMIT}&offset=${currentOffset}`)
				if (!response.ok) {
					throw new Error('Failed to fetch riddles')
				}

				const data: PaginatedRiddlesDataType = await response.json()
				setRiddles((prev) => [...prev, ...data.riddles])
				setHasMore(data.pagination.hasNext)
				setOffset(currentOffset + LIMIT)
			} catch (error) {
				console.error('Error fetching riddles:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[LIMIT, isLoading]
	)

	const handleLoadMore = () => {
		fetchRiddles(offset)
	}

	// Initial load
	useEffect(() => {
		fetchRiddles(0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<GoogleAdVerticalFixed />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-4xl mx-auto px-4 py-8 gap-6">
			<div className="w-full flex items-center justify-between gap-4">
				<h1 className="text-3xl md:text-4xl text-left">Riddle Feed</h1>
				<p className="text-sm md:text-base text-gray-400 whitespace-nowrap"></p>
			</div>

			<div className="w-full flex flex-col gap-6">
				{riddles.map((riddle, index) => {
					const isWebCreated = riddle.postId.startsWith('r_')
					const showAd = (index + 1) % 5 === 0
					return (
						<div key={riddle.postId}>
							<div className="w-full flex flex-col gap-3">
								{isWebCreated && riddle.author ? (
									<RiddleAuthorHeader
										username={riddle.author}
										avatar={riddle.authorAvatar}
										createdAt={riddle.date || undefined}
										className="px-2"
									/>
								) : (
									<div className="flex items-center justify-start px-2">
										<p className="text-sm opacity-90">{formatDate(riddle.date)}</p>
									</div>
								)}
								{/* RiddleCard automatically hides eye (guessCount) and star (popularity) icons for web-created riddles (postId starts with "r_") */}
								<RiddleCard riddle={riddle} className="w-full" textClassName="line-clamp-5" />
							</div>
							{showAd && <GoogleAdInFeedUnit key={`ad-${riddle.postId}`} customClasses="my-4" />}
						</div>
					)
				})}
			</div>

			{/* Load More Button */}
			{hasMore && riddles.length > 0 && (
				<div className="w-full flex justify-center mt-4">
					<button
						onClick={handleLoadMore}
						disabled={isLoading}
						className="relative group bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg px-6 py-3 flex items-center gap-3 shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.7)] active:translate-y-[4px] transition-all duration-150 disabled:translate-y-0 disabled:shadow-[0_5px_0_0_rgba(0,0,0,0.3)]"
					>
						{isLoading ? (
							<>
								<Image
									src="/icons/button_xbox_x.png"
									alt="Loading"
									width={28}
									height={28}
									className="w-7 h-7 animate-spin"
									unoptimized
								/>
								<span className="text-lg">Loading...</span>
							</>
						) : (
							<>
								<Image
									src="/icons/button_xbox_x.png"
									alt="Load More"
									width={28}
									height={28}
									className="w-7 h-7"
								/>
								<span className="text-lg">Load More Riddles</span>
							</>
						)}
					</button>
				</div>
			)}

			{!hasMore && riddles.length > 0 && <NothingMoreToLoad />}
			</div>
		</>
	)
}
