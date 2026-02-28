'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { ShareButton } from '@/app/components/ShareButton'
import { useAuth } from '@/app/contexts/AuthContext'
import type { SafeRiddleType } from '@/app/schemas/DailyRiddleSchema'
import { getMyRiddles, type UserRiddle } from '@/app/services/userService'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const LIMIT = 20

const getStatusBadgeColor = (status: string) => {
	switch (status) {
		case 'APPROVED':
			return 'bg-tertiary text-white border-tertiary'
		case 'IN_REVIEW':
			return 'bg-primary text-white border-primary'
		case 'REJECTED':
			return 'bg-red-500 text-white border-red-500'
		case 'REMOVED':
			return 'bg-[var(--color-bg)] text-white/40 border-white/20'
		default:
			return 'bg-[var(--color-bg)] text-white/40 border-white/20'
	}
}

const getStatusLabel = (status: string) => {
	switch (status) {
		case 'APPROVED':
			return 'Approved'
		case 'IN_REVIEW':
			return 'Pending Review'
		case 'REJECTED':
			return 'Rejected'
		case 'REMOVED':
			return 'Removed'
		default:
			return status
	}
}

const convertToSafeRiddleType = (riddle: UserRiddle): SafeRiddleType => {
	return {
		riddleNumber: 0,
		featuredDate: new Date(riddle.createdAt),
		postId: riddle.postId,
		type: riddle.type || null,
		author: riddle.author || null,
		authorSnoo: null,
		solverSnooAvatars: null,
		userId: riddle.userid,
		date: new Date(riddle.createdAt).getTime().toString(),
		riddle: riddle.riddle,
		bg: riddle.bg || null,
		workshopFont: null,
		authorEnabledHints: null,
		feedbackCommentEnabled: null,
		subreddit: null,
		postType: null,
		score: riddle.score,
		popularity: riddle.score,
		solved: null,
		guessCount: '0',
		guessCorrectlyCount: null,
		giveUpCount: null,
		title: null,
		context: null,
		userid: riddle.userid,
		subredditId: null,
		wordLength: riddle.word.length,
	}
}

export default function RiddlesPage() {
	const { user, isLoading: authLoading } = useAuth()
	const [riddles, setRiddles] = useState<UserRiddle[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [hasMore, setHasMore] = useState(false)
	const [currentPage, setCurrentPage] = useState(0)
	const isFetchingRef = useRef(false)

	const fetchRiddles = useCallback(async (page: number) => {
		if (isFetchingRef.current) return

		isFetchingRef.current = true
		setLoading(true)
		setError(null)

		try {
			const offset = page * LIMIT
			const data = await getMyRiddles(LIMIT, offset)
			setRiddles(data.data.riddles)
			setHasMore(data.data.riddles.length === LIMIT)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch riddles')
		} finally {
			setLoading(false)
			isFetchingRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!authLoading && user) {
			fetchRiddles(currentPage)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, user, currentPage])

	const filteredRiddles = useMemo(() => {
		// Show IN_REVIEW and APPROVED riddles, sorted by newest first
		return riddles
			.filter((riddle) => riddle.status === 'IN_REVIEW' || riddle.status === 'APPROVED')
			.sort((a, b) => {
				const dateA = new Date(a.createdAt).getTime()
				const dateB = new Date(b.createdAt).getTime()
				return dateB - dateA // Newest first
			})
	}, [riddles])

	const handlePreviousPage = () => {
		if (currentPage > 0 && !loading) {
			setCurrentPage((prev) => prev - 1)
		}
	}

	const handleNextPage = () => {
		if (hasMore && !loading) {
			setCurrentPage((prev) => prev + 1)
		}
	}

	if (authLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="w-full">
			<div className="bg-[var(--color-bg)] rounded-lg shadow-lg md:p-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl md:text-3xl">My Riddles</h1>
					{!loading && (
						<span className="text-white/60 text-sm md:text-base">
							{filteredRiddles.length} {filteredRiddles.length === 1 ? 'riddle' : 'riddles'}
						</span>
					)}
				</div>

				{/* Error State */}
				{error && (
					<div className="bg-[var(--color-bg)] border-2 border-red-500 rounded-lg p-4 mb-6">
						<h3 className="text-red-400 mb-2">Error</h3>
						<p className="text-red-300 mb-4">{error}</p>
						<BasicButton onClick={() => fetchRiddles(currentPage)} text="Retry" />
					</div>
				)}

				{/* Loading State */}
				{loading && filteredRiddles.length === 0 && (
					<div className="text-center py-12">
						<p className="text-white/60">Loading your riddles...</p>
					</div>
				)}

				{/* Empty State */}
				{!loading && filteredRiddles.length === 0 && !error && (
					<div className="bg-[var(--color-bg)] rounded-lg p-6 border-2 border-transparent hover:border-primary text-center">
						<p className="text-white/70 mb-4">You don&apos;t have any approved or pending riddles.</p>
						<Link href="/user/me/create">
							<BasicButton text="Create Your First Riddle" />
						</Link>
					</div>
				)}

				{/* Riddles List */}
				{!loading && filteredRiddles.length > 0 && (
					<div className="space-y-6">
						{filteredRiddles.map((riddle) => {
							const dailyRiddle = convertToSafeRiddleType(riddle)
							return (
								<div key={riddle.postId} className="bg-[var(--color-bg)] rounded-lg">
									<div className="mb-4">
										<div className="flex items-center justify-between mb-2 flex-wrap">
											<h3 className="text-xl text-white">Word: {riddle.word}</h3>
											{riddle.status === 'APPROVED' && (
												<ShareButton
													url={
														typeof window !== 'undefined'
															? `${window.location.origin}/riddle/${riddle.postId}`
															: `/riddle/${riddle.postId}`
													}
													title={`Share this riddle: ${riddle.word}`}
													buttonText="Share Riddle"
												/>
											)}
										</div>
										<div className="flex items-center justify-between flex-wrap">
											<p className="text-sm text-white/60">
												From: {new Date(riddle.createdAt).toLocaleDateString()}
											</p>
											<span
												className={`px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadgeColor(
													riddle.status
												)}`}
											>
												{getStatusLabel(riddle.status)}
											</span>
										</div>
									</div>

									{/* Riddle Card */}
									<div className="mb-4">
										<RiddleCard riddle={dailyRiddle} className="w-full" hideSolveButton={true} />
									</div>

									{/* Explanation */}
									{riddle.explanation && (
										<div className="mt-4 pt-4 border-t-2 border-primary">
											<p className="text-sm text-white/60 mb-1">Explanation:</p>
											<p className="text-sm text-white/80">{riddle.explanation}</p>
										</div>
									)}
								</div>
							)
						})}
					</div>
				)}

				{/* Pagination */}
				{!loading && filteredRiddles.length > 0 && (
					<div className="mt-6 flex justify-center items-center gap-4">
						<BasicButton onClick={handlePreviousPage} disabled={currentPage === 0 || loading} text="Back" />
						<span className="text-white/60">Page {currentPage + 1}</span>
						<BasicButton
							onClick={handleNextPage}
							disabled={!hasMore || loading}
							text="Next"
							customClass="flex"
						/>
					</div>
				)}
			</div>
		</div>
	)
}
