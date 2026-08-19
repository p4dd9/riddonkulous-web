'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { RedditLinkButton } from '@/app/components/buttons/RedditLinkButton'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { HintModal } from '@/app/components/modals/HintModal'
import { RevealModal } from '@/app/components/modals/RevealModal'
import { ClassicTextInput } from '@/app/components/riddles/ClassicTextInput'
import { RiddleAuthorHeader } from '@/app/components/riddles/RiddleAuthorHeader'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { ShareButton } from '@/app/components/ShareButton'
import { recordSolve } from '@/app/lib/solveCounter'
import type { SafeRiddleType } from '@/app/schemas/DailyRiddleSchema'
import {
	checkAnswer as checkAnswerAction,
	getRandomRiddle,
	revealAnswer as revealAnswerAction,
} from '@/app/services/riddleService'
import { formatDate } from '@/app/util/format'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react'

interface RiddleSingleViewProps {
	riddle: SafeRiddleType
	onContinueNext?: () => void
	onPrevious?: () => void
	hasNext?: boolean
	hasPrevious?: boolean
	continueUrl?: string
	previousUrl?: string
	onRandomContinue?: () => void
	showContinue?: boolean
	title?: string | ReactNode
	showDate?: boolean
	showRedditButton?: boolean
	showShareButton?: boolean
}

export const RiddleSingleView = ({
	riddle,
	onContinueNext,
	onPrevious,
	hasNext = false,
	hasPrevious = false,
	continueUrl,
	previousUrl,
	onRandomContinue,
	showContinue = true,
	title,
	showDate = false,
	showRedditButton = false,
	showShareButton = false,
}: RiddleSingleViewProps) => {
	const router = useRouter()
	const [isContinuing, setIsContinuing] = useState(false)
	const barRef = useRef<HTMLDivElement>(null)
	const [barHeight, setBarHeight] = useState<number | null>(null)

	// Measure the fixed bottom bar so scrollable content can reserve matching space beneath it.
	useEffect(() => {
		const bar = barRef.current
		if (!bar) return

		const measureHeight = () => setBarHeight(bar.offsetHeight)

		measureHeight()
		window.addEventListener('resize', measureHeight)

		return () => {
			window.removeEventListener('resize', measureHeight)
		}
	}, [showContinue, hasPrevious])

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

	const handleContinue = async () => {
		if (isContinuing) return

		if (hasNext) {
			if (onContinueNext) {
				onContinueNext()
				return
			}
			if (continueUrl) {
				router.push(continueUrl)
				return
			}
		}

		if (onRandomContinue) {
			onRandomContinue()
			return
		}

		setIsContinuing(true)
		try {
			const randomRiddle = await getRandomRiddle(riddle.postId)
			router.push(`/riddle/${randomRiddle.postId}`)
		} catch (error) {
			console.error('Failed to load random riddle:', error)
			setIsContinuing(false)
		}
	}

	const handlePrevious = () => {
		if (onPrevious) {
			onPrevious()
		} else if (previousUrl) {
			router.push(previousUrl)
		} else {
			router.back()
		}
	}

	const checkAnswer = async () => {
		if (!state.answer.trim()) return

		dispatch({ type: 'SET_HAS_GUESSED', payload: true })

		const result = await checkAnswerAction(riddle.postId, state.answer)

		if (result.correct) {
			dispatch({ type: 'SET_FEEDBACK', payload: 'correct' })
			dispatch({ type: 'SET_IS_SOLVED', payload: true })
			// Guessed, not revealed — handleReveal deliberately does not count.
			recordSolve(riddle.postId)
		} else {
			dispatch({ type: 'SET_FEEDBACK', payload: 'incorrect' })
		}
	}

	const handleAnswerChange = (newAnswer: string) => {
		if (state.feedback === 'incorrect' && !state.isSolved) {
			dispatch({ type: 'SET_FEEDBACK', payload: null })
		}
		dispatch({ type: 'SET_ANSWER', payload: newAnswer })
	}

	const handleReveal = async () => {
		const result = await revealAnswerAction(riddle.postId)
		dispatch({ type: 'SET_IS_REVEALED', payload: true })
		dispatch({ type: 'SET_IS_SOLVED', payload: true })
		dispatch({ type: 'SET_ANSWER', payload: result.word })
		dispatch({ type: 'SET_FEEDBACK', payload: 'correct' })
	}

	const isWebCreated = riddle.postId.startsWith('r_')

	return (
		<>
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
									{showRedditButton && riddle.subreddit && riddle.postId && (
										<RedditLinkButton
											href={`https://www.reddit.com/r/${riddle.subreddit}/comments/${riddle.postId}/`}
										/>
									)}
									{showShareButton && <ShareButton title="Share this riddle" />}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Main Riddle Card - internally scrollable so long riddles never push the fixed bottom bar off-screen */}
				<div className="w-full max-h-[50vh] overflow-y-auto rounded-lg lg:max-h-none lg:overflow-visible">
					<RiddleCard riddle={riddle} className="lg:h-[400px]" hideSolveButton={true} />
				</div>

				{/* Hint / Reveal + feedback (contextual, stays in normal flow) */}
				<div className="w-full flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<div className="w-full flex flex-col md:flex-row gap-2">
							{state.hasGuessed && !state.isSolved ? (
								<button
									onClick={() => dispatch({ type: 'SET_IS_HINT_MODAL_OPEN', payload: true })}
									className="flex items-center justify-center gap-2 px-3 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full md:w-auto"
									aria-label="Show hint"
								>
									<Image
										src="/icons/item.png"
										alt="Hint"
										width={20}
										height={20}
										className="w-5 h-5"
									/>
									<span className="text-sm">Show Hint</span>
								</button>
							) : !state.hasGuessed ? (
								<div className="flex items-center justify-center gap-2 px-3 py-3 rounded-md w-full md:w-auto invisible pointer-events-none">
									<Image src="/icons/item.png" alt="" width={20} height={20} className="w-5 h-5" />
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

				{/* Spacer reserving space for the fixed bottom bar so content never sits underneath it */}
				<div style={{ height: barHeight ? `${barHeight}px` : undefined }} aria-hidden="true" />

				{/* Hint Modal */}
				<BottomSheetModal
					isOpen={state.isHintModalOpen}
					onClose={() => dispatch({ type: 'SET_IS_HINT_MODAL_OPEN', payload: false })}
					title="Hint"
					icon="/icons/item.png"
				>
					<HintModal
						wordLength={riddle.wordLength}
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
			</div>

			{/* Fixed bottom bar - answer input, check button and prev/next nav are always reachable, never clipped by long riddles */}
			<div
				ref={barRef}
				className="fixed bottom-0 inset-x-0 z-[90] bg-[var(--color-bg)] border-t-2 border-primary/40 pb-safe"
			>
				<div className="max-w-4xl mx-auto flex flex-col gap-2 px-4 pt-3">
					<div className="flex flex-row gap-2 items-stretch">
						<ClassicTextInput
							className="flex-1 min-w-0"
							value={state.answer}
							onChange={handleAnswerChange}
							disabled={state.isSolved}
							feedback={state.feedback}
							resetKey={riddle.postId}
							onEnter={() => {
								if (!state.isSolved) checkAnswer()
							}}
						/>
						<BasicButton
							text={state.isSolved ? 'Solved!' : 'Submit'}
							onClick={checkAnswer}
							customClass={`shrink-0 px-3 py-3 md:px-4 ${state.isSolved ? 'opacity-60 cursor-not-allowed' : ''}`}
							disabled={state.isSolved || !state.answer.trim()}
						/>
					</div>
					{(showContinue || hasPrevious) && (
						<div className="w-full flex justify-between gap-4 pb-2">
							<BasicButton
								text="Back"
								onClick={handlePrevious}
								customClass="px-4 py-2 md:px-8 md:min-w-[120px]"
							/>
							{showContinue && (
								<BasicButton
									text={isContinuing ? 'Loading...' : 'Next'}
									onClick={handleContinue}
									customClass="px-4 py-2 md:px-8 md:min-w-[120px]"
									disabled={isContinuing}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
