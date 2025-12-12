'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { RevealModal } from '@/app/components/modals/RevealModal'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RiddleSingleViewProps {
	riddle: DailyRiddleType
	onNext?: () => void
	onPrevious?: () => void
	hasNext?: boolean
	hasPrevious?: boolean
	nextUrl?: string
	previousUrl?: string
}

export const RiddleSingleView = ({
	riddle,
	onNext,
	onPrevious,
	hasNext = false,
	hasPrevious = false,
	nextUrl,
	previousUrl,
}: RiddleSingleViewProps) => {
	const router = useRouter()
	const [answer, setAnswer] = useState('')
	const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
	const [isSolved, setIsSolved] = useState(false)
	const [isRevealed, setIsRevealed] = useState(false)
	const [isRevealModalOpen, setIsRevealModalOpen] = useState(false)
	const [hasGuessed, setHasGuessed] = useState(false)

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
		if (!answer.trim()) return

		setHasGuessed(true)

		const normalizedAnswer = answer.trim().toLowerCase()
		const correctAnswer = riddle.word.toLowerCase()
		const altAnswers = riddle.altwords ? riddle.altwords.split(',').map((w) => w.trim().toLowerCase()) : []

		const isCorrect = normalizedAnswer === correctAnswer || altAnswers.some((alt) => normalizedAnswer === alt)

		if (isCorrect) {
			setFeedback('correct')
			setIsSolved(true)
		} else {
			setFeedback('incorrect')
			setTimeout(() => {
				setFeedback(null)
				setAnswer('')
			}, 2000)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !isSolved) {
			checkAnswer()
		}
	}

	const handleReveal = () => {
		setIsRevealed(true)
		setIsSolved(true)
		setAnswer(riddle.word)
		setFeedback('correct')
	}

	console.log(riddle)
	return (
		<div className="w-full flex flex-col gap-6 max-w-4xl mx-auto px-4 py-8">
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
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							onKeyPress={handleKeyPress}
							disabled={isSolved}
							className={`w-full md:flex-1 px-4 py-2 rounded-md border-2 ${
								feedback === 'correct'
									? 'border-green-500 bg-green-50'
									: feedback === 'incorrect'
										? 'border-red-500 bg-red-50'
										: 'border-gray-300'
							} ${isSolved ? 'opacity-60 cursor-not-allowed' : ''}`}
							placeholder="Type your answer here..."
						/>
						<BasicButton
							text={isSolved ? 'Solved!' : 'Check Answer'}
							onClick={checkAnswer}
							customClass={`w-full md:w-auto py-3 ${isSolved ? 'opacity-60 cursor-not-allowed' : ''}`}
							disabled={isSolved || !answer.trim()}
						/>
					</div>
					<div className="w-full md:w-auto">
						{hasGuessed && !isSolved && !isRevealed ? (
							<button
								onClick={() => setIsRevealModalOpen(true)}
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
						) : !hasGuessed ? (
							<div className="flex items-center justify-center gap-2 px-3 py-3 rounded-md w-full md:w-auto invisible pointer-events-none">
								<Image src="/icons/unlock.png" alt="" width={20} height={20} className="w-5 h-5" />
								<span className="text-sm">Reveal</span>
							</div>
						) : null}
					</div>
					{feedback === 'correct' && (
						<p className="text-green-600 font-semibold">
							{isRevealed ? '🔓 Answer revealed!' : '🎉 Correct! Well done!'}
						</p>
					)}
					{feedback === 'incorrect' && <p className="text-red-600 font-semibold">❌ Incorrect. Try again!</p>}
				</div>
			</div>

			{/* Reveal Modal */}
			<BottomSheetModal
				isOpen={isRevealModalOpen}
				onClose={() => setIsRevealModalOpen(false)}
				title="Reveal Answer"
				icon="/icons/unlock.png"
			>
				<RevealModal onConfirm={handleReveal} onClose={() => setIsRevealModalOpen(false)} />
			</BottomSheetModal>

			{/* Navigation Buttons (for category playlists) */}
			{(hasNext || hasPrevious) && (
				<div className="w-full flex justify-between gap-4">
					<BasicButton
						text="Previous"
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

			{/* Ad Placeholder */}
			<div className="w-full flex justify-center items-center mt-4">
				<div
					className="w-full flex items-center justify-center rounded-lg"
					style={{
						minWidth: '120px',
						minHeight: '100px',
						maxWidth: 'min(100%, 1200px)',
						backgroundColor: '#f3f4f6',
					}}
				>
					<span className="text-sm text-gray-500">Advertisement</span>
				</div>
			</div>
		</div>
	)
}
