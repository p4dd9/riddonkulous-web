'use client'

import { NothingMoreToLoad } from '@/app/components/NothingMoreToLoad'
import { RiddleAuthorHeader } from '@/app/components/riddles/RiddleAuthorHeader'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import type { PaginatedRiddlesDataType } from '@/app/schemas/PaginatedRiddlesResponse'
import { formatDate } from '@/app/util/format'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function RiddleFeedPage() {
	const [riddles, setRiddles] = useState<DailyRiddleType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [hasMore, setHasMore] = useState(true)
	const [offset, setOffset] = useState(0)
	const observerTarget = useRef<HTMLDivElement>(null)
	const isLoadingRef = useRef(false)

	const LIMIT = 5

	const fetchRiddles = useCallback(
		async (currentOffset: number) => {
			if (isLoadingRef.current) return

			isLoadingRef.current = true
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
				isLoadingRef.current = false
			}
		},
		[LIMIT]
	)

	useEffect(() => {
		fetchRiddles(0)
	}, [fetchRiddles])

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					fetchRiddles(offset)
				}
			},
			{ threshold: 0.1 }
		)

		const currentTarget = observerTarget.current
		if (currentTarget) {
			observer.observe(currentTarget)
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget)
			}
		}
	}, [hasMore, isLoading, offset, fetchRiddles])

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-4xl mx-auto px-4 py-8 gap-6">
			<div className="w-full flex items-center justify-between gap-4">
				<h1 className="text-3xl md:text-4xl text-left">Riddle Feed</h1>
				<p className="text-sm md:text-base text-gray-400 whitespace-nowrap"></p>
			</div>

			<div className="w-full flex flex-col gap-6">
				{riddles.map((riddle) => {
					const isWebCreated = riddle.postId.startsWith('r_')
					return (
						<div key={riddle.postId} className="w-full flex flex-col gap-3">
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
					)
				})}
			</div>

			{/* Intersection observer target */}
			<div ref={observerTarget} className="w-full h-20 flex items-center justify-center">
				{isLoading && <p className="text-gray-400">Loading more riddles...</p>}
			</div>

			{!hasMore && riddles.length > 0 && <NothingMoreToLoad />}
		</div>
	)
}
