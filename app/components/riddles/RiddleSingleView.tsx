'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { HintModal } from '@/app/components/modals/HintModal'
import { RevealModal } from '@/app/components/modals/RevealModal'
import { RiddleAuthorHeader } from '@/app/components/riddles/RiddleAuthorHeader'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { ShareButton } from '@/app/components/ShareButton'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import { formatDate } from '@/app/util/format'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, type ReactNode } from 'react'

interface RiddleSingleViewProps {
	riddle: DailyRiddleType
	onNext?: () => void
	onPrevious?: () => void
	hasNext?: boolean
	hasPrevious?: boolean
	nextUrl?: string
	previousUrl?: string
	title?: string | ReactNode
	showDate?: boolean
	showRedditButton?: boolean
	showShareButton?: boolean
}

export const RiddleSingleView = ({
	riddle,
	onNext,
	onPrevious,
	hasNext = false,
	hasPrevious = false,
	nextUrl,
	previousUrl,
	title,
	showDate = false,
	showRedditButton = false,
	showShareButton = false,
}: RiddleSingleViewProps) => {
	const router = useRouter()

	type RiddleState = {
		answer: string
		feedback: 'correct' | 'incorrect' | null
		isSolved: boolean
		isRevealed: boolean
		isRevealModalOpen: boolean
		isHintModalOpen: boolean
		hasGuessed: boolean
	}

	type RiddleAction =
		| { type: 'SET_ANSWER'; payload: string }
		| { type: 'SET_FEEDBACK'; payload: 'correct' | 'incorrect' | null }
		| { type: 'SET_IS_SOLVED'; payload: boolean }
		| { type: 'SET_IS_REVEALED'; payload: boolean }
		| { type: 'SET_IS_REVEAL_MODAL_OPEN'; payload: boolean }
		| { type: 'SET_IS_HINT_MODAL_OPEN'; payload: boolean }
		| { type: 'SET_HAS_GUESSED'; payload: boolean }
		| { type: 'RESET' }

	const initialState: RiddleState = {
		answer: '',
		feedback: null,
		isSolved: false,
		isRevealed: false,
		isRevealModalOpen: false,
		isHintModalOpen: false,
		hasGuessed: false,
	}

	const reducer = (state: RiddleState, action: RiddleAction): RiddleState => {
		switch (action.type) {
			case 'SET_ANSWER':
				return { ...state, answer: action.payload }
			case 'SET_FEEDBACK':
				return { ...state, feedback: action.payload }
			case 'SET_IS_SOLVED':
				return { ...state, isSolved: action.payload }
			case 'SET_IS_REVEALED':
				return { ...state, isRevealed: action.payload }
			case 'SET_IS_REVEAL_MODAL_OPEN':
				return { ...state, isRevealModalOpen: action.payload }
			case 'SET_IS_HINT_MODAL_OPEN':
				return { ...state, isHintModalOpen: action.payload }
			case 'SET_HAS_GUESSED':
				return { ...state, hasGuessed: action.payload }
			case 'RESET':
				return initialState
			default:
				return state
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState)

	// Reset state when riddle changes
	useEffect(() => {
		dispatch({ type: 'RESET' })
	}, [riddle.postId])

	const handleNext = () => {
		if (onNext) {
			onNext()
		} else if (nextUrl) {
			router.push(nextUrl)
		}
	}

	const handlePrevious = () => {
		if (onPrevious) {
			onPrevious()
		} else if (previousUrl) {
			router.push(previousUrl)
		}
	}

	const checkAnswer = () => {
		if (!state.answer.trim()) return

		dispatch({ type: 'SET_HAS_GUESSED', payload: true })

		const normalizedAnswer = state.answer.trim().toLowerCase()
		const correctAnswer = riddle.word.toLowerCase()
		const altAnswers = riddle.altwords ? riddle.altwords.split(',').map((w) => w.trim().toLowerCase()) : []

		const isCorrect = normalizedAnswer === correctAnswer || altAnswers.some((alt) => normalizedAnswer === alt)

		if (isCorrect) {
			dispatch({ type: 'SET_FEEDBACK', payload: 'correct' })
			dispatch({ type: 'SET_IS_SOLVED', payload: true })
		} else {
			dispatch({ type: 'SET_FEEDBACK', payload: 'incorrect' })
		}
	}

	const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newAnswer = e.target.value
		// Clear incorrect feedback when user starts typing again (but keep correct feedback if solved)
		if (state.feedback === 'incorrect' && !state.isSolved) {
			dispatch({ type: 'SET_FEEDBACK', payload: null })
		}
		dispatch({ type: 'SET_ANSWER', payload: newAnswer })
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !state.isSolved) {
			checkAnswer()
		}
	}

	const handleReveal = () => {
		dispatch({ type: 'SET_IS_REVEALED', payload: true })
		dispatch({ type: 'SET_IS_SOLVED', payload: true })
		dispatch({ type: 'SET_ANSWER', payload: riddle.word })
		dispatch({ type: 'SET_FEEDBACK', payload: 'correct' })
	}

	const isWebCreated = riddle.postId.startsWith('r_')

	return (
		<div className="w-full flex flex-col gap-6 max-w-4xl mx-auto ">
			{/* Header Section */}
			{(title || showDate || showRedditButton || showShareButton || (isWebCreated && riddle.author)) && (
				<div className="w-full flex flex-col gap-4">
					{title && <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2">{title}</h1>}
					{/* Author Header + Action Buttons Row */}
					<div className="w-full flex items-center justify-between gap-4">
						{/* Left side: Author or Date */}
						{isWebCreated && riddle.author ? (
							<RiddleAuthorHeader
								username={riddle.author}
								avatar={riddle.authorAvatar}
								createdAt={riddle.date || undefined}
							/>
						) : showDate ? (
							<p>{formatDate(riddle.date)}</p>
						) : (
							<div />
						)}
						{/* Right side: Action Buttons */}
						{(showRedditButton || showShareButton) && (
							<div className="flex items-center gap-2 flex-shrink-0">
								{/* {showRedditButton && riddle.subreddit && riddle.postId && (
									<RedditLinkButton
										href={`https://www.reddit.com/r/${riddle.subreddit}/comments/${riddle.postId}/`}
									/>
								)} */}
								{showShareButton && <ShareButton title="Share this riddle" />}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Main Riddle Card */}
			<div className="w-full">
				<RiddleCard riddle={riddle} className="lg:h-[400px]" hideSolveButton={true} />
			</div>

			{/* Answer Input Section */}
			<div className="w-full flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<div className="flex flex-col md:flex-row gap-2">
						<input
							id="riddle-answer"
							type="text"
							value={state.answer}
							onChange={handleAnswerChange}
							onKeyPress={handleKeyPress}
							disabled={state.isSolved}
							className={`w-full md:flex-1 px-4 py-2 rounded-md border-2 outline-none focus:outline-none focus:ring-0 ${
								state.feedback === 'correct'
									? 'border-green-500'
									: state.feedback === 'incorrect'
										? 'border-red-500'
										: 'border-gray-300'
							} ${state.isSolved ? 'opacity-60 cursor-not-allowed' : ''}`}
							placeholder="Type your answer here..."
						/>
						<BasicButton
							text={state.isSolved ? 'Solved!' : 'Check Answer'}
							onClick={checkAnswer}
							customClass={`w-full md:w-auto py-3 ${state.isSolved ? 'opacity-60 cursor-not-allowed' : ''}`}
							disabled={state.isSolved || !state.answer.trim()}
						/>
					</div>
					<div className="w-full flex flex-col md:flex-row gap-2">
						{state.hasGuessed && !state.isSolved ? (
							<button
								onClick={() => dispatch({ type: 'SET_IS_HINT_MODAL_OPEN', payload: true })}
								className="flex items-center justify-center gap-2 px-3 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full md:w-auto"
								aria-label="Show hint"
							>
								<Image src="/icons/light.png" alt="Hint" width={20} height={20} className="w-5 h-5" />
								<span className="text-sm">Show Hint</span>
							</button>
						) : !state.hasGuessed ? (
							<div className="flex items-center justify-center gap-2 px-3 py-3 rounded-md w-full md:w-auto invisible pointer-events-none">
								<Image src="/icons/light.png" alt="" width={20} height={20} className="w-5 h-5" />
								<span className="text-sm">Show Hint</span>
							</div>
						) : null}
						{state.hasGuessed && !state.isSolved && !state.isRevealed ? (
							<button
								onClick={() => dispatch({ type: 'SET_IS_REVEAL_MODAL_OPEN', payload: true })}
								className="flex items-center justify-center gap-2 px-3 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full md:w-auto"
								aria-label="Reveal answer"
							>
								<Image
									src="/icons/unlock.png"
									alt="Reveal"
									width={20}
									height={20}
									className="w-5 h-5"
								/>
								<span className="text-sm">Reveal</span>
							</button>
						) : !state.hasGuessed ? (
							<div className="flex items-center justify-center gap-2 px-3 py-3 rounded-md w-full md:w-auto invisible pointer-events-none">
								<Image src="/icons/unlock.png" alt="" width={20} height={20} className="w-5 h-5" />
								<span className="text-sm">Reveal</span>
							</div>
						) : null}
					</div>
					{state.feedback === 'correct' && (
						<p className="text-green-600 ">
							{state.isRevealed ? '🔓 Answer revealed!' : '🎉 Correct! Well done!'}
						</p>
					)}
					{state.feedback === 'incorrect' && <p className="text-red-600 ">❌ Incorrect. Try again!</p>}
				</div>
			</div>

			{/* Hint Modal */}
			<BottomSheetModal
				isOpen={state.isHintModalOpen}
				onClose={() => dispatch({ type: 'SET_IS_HINT_MODAL_OPEN', payload: false })}
				title="Hint"
				icon="/icons/light.png"
			>
				<HintModal
					wordLength={riddle.word.length}
					onClose={() => dispatch({ type: 'SET_IS_HINT_MODAL_OPEN', payload: false })}
				/>
			</BottomSheetModal>

			{/* Reveal Modal */}
			<BottomSheetModal
				isOpen={state.isRevealModalOpen}
				onClose={() => dispatch({ type: 'SET_IS_REVEAL_MODAL_OPEN', payload: false })}
				title="Reveal Answer"
				icon="/icons/unlock.png"
			>
				<RevealModal
					onConfirm={handleReveal}
					onClose={() => dispatch({ type: 'SET_IS_REVEAL_MODAL_OPEN', payload: false })}
				/>
			</BottomSheetModal>

			{/* Navigation Buttons (for category playlists) */}
			{(hasNext || hasPrevious) && (
				<div className="w-full flex justify-between gap-4">
					<BasicButton
						text="Back"
						onClick={handlePrevious}
						customClass={!hasPrevious ? 'opacity-50 cursor-not-allowed' : ''}
						disabled={!hasPrevious}
					/>
					<BasicButton
						text="Next"
						onClick={handleNext}
						customClass={!hasNext ? 'opacity-50 cursor-not-allowed' : ''}
						disabled={!hasNext}
					/>
				</div>
			)}
		</div>
	)
}
