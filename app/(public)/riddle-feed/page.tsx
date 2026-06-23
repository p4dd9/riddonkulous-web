'use client'

import { GoogleAdInFeedUnit } from '@/app/components/ads/GoogleAdInFeedUnit'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { LoginButton } from '@/app/components/buttons/LoginButton'
import { NothingMoreToLoad } from '@/app/components/NothingMoreToLoad'
import { RiddleAuthorHeader } from '@/app/components/riddles/RiddleAuthorHeader'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { useAuth } from '@/app/contexts/AuthContext'
import type { SafeRiddleType } from '@/app/schemas/DailyRiddleSchema'
import type { PaginationType } from '@/app/schemas/PaginatedRiddlesResponse'
import { formatDate } from '@/app/util/format'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

const RiddleFeedLoginGate = () => (
	<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8">
		<div className="w-full max-w-md">
			<div className="bg-[var(--color-bg)] rounded-lg shadow-lg p-8 border border-white/10">
				<div className="flex justify-center mb-6">
					<Image
						src="/icons/script_lightning.png"
						alt="Newest Riddles"
						width={64}
						height={64}
						className="w-16 h-16"
					/>
				</div>
				<h1 className="text-3xl mb-2 text-center">Newest Riddles</h1>
				<p className="text-white/80 mb-4 text-center text-lg">
					You need to be logged in to read the newest riddles feed.
				</p>
				<p className="text-white/60 mb-8 text-center">
					Sign in with Google to browse the latest riddles from the community. If you don&apos;t have an
					account yet, signing in will create one for you.
				</p>
				<div className="flex justify-center">
					<LoginButton variant="drawer" className="w-full" />
				</div>
			</div>
		</div>
	</div>
)

const RiddleFeedContent = () => {
	const [riddles, setRiddles] = useState<SafeRiddleType[]>([])
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

				const data: { riddles: SafeRiddleType[]; pagination: PaginationType } = await response.json()
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
									<RiddleCard riddle={riddle} className="w-full" textClassName="line-clamp-5" />
								</div>
								{showAd && <GoogleAdInFeedUnit key={`ad-${riddle.postId}`} customClasses="my-4" />}
							</div>
						)
					})}
				</div>

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

export default function RiddleFeedPage() {
	const { user, isLoading } = useAuth()

	if (isLoading) {
		return (
			<div className="relative h-full min-h-screen w-full flex items-center justify-center px-4">
				<p className="text-white/70">Loading...</p>
			</div>
		)
	}

	if (!user) {
		return <RiddleFeedLoginGate />
	}

	return <RiddleFeedContent />
}
