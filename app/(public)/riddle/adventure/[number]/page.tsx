'use client'

import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { BasicButton } from '@/app/components/buttons/BasicButton'
import { AdventureShareModal } from '@/app/components/modals/AdventureShareModal'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { LetterRearrangeInput } from '@/app/components/riddles/LetterRearrangeInput'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdventureRun {
	adventureNumber: number
	date: string
	seed: string
	startTime: number
	endTime?: number
	riddles: RiddleRun[]
}

interface RiddleRun {
	riddleId: string
	attempts: number
	solved: boolean
	startTime: number
	solveTime?: number
}

interface AdventureResponse {
	status: string
	data: {
		adventure: {
			adventureNumber: number
			featuredDate: string
			seed: string
			postIds: string[]
		}
		riddles: DailyRiddleType[]
	}
}

const STORAGE_KEY_PREFIX = 'riddonkulous-adventure-'

const getStorageKey = (adventureNumber: number) => `${STORAGE_KEY_PREFIX}${adventureNumber}`

const loadAdventureProgress = (adventureNumber: number): AdventureRun | null => {
	if (typeof window === 'undefined') return null
	try {
		const stored = localStorage.getItem(getStorageKey(adventureNumber))
		if (!stored) return null
		return JSON.parse(stored)
	} catch {
		return null
	}
}

const saveAdventureProgress = (run: AdventureRun) => {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(getStorageKey(run.adventureNumber), JSON.stringify(run))
	} catch (error) {
		console.error('Failed to save adventure progress:', error)
	}
}

export default function AdventurePage({ params }: { params: Promise<{ number: string }> }) {
	const router = useRouter()
	const [adventureNumber, setAdventureNumber] = useState<number | null>(null)
	const [adventure, setAdventure] = useState<AdventureResponse['data'] | null>(null)
	const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0)
	const [adventureRun, setAdventureRun] = useState<AdventureRun | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [answer, setAnswer] = useState('')
	const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
	const [showTransition, setShowTransition] = useState(false)
	const [showEndScreen, setShowEndScreen] = useState(false)
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)

	// Load params and initialize
	useEffect(() => {
		const loadParams = async () => {
			const resolvedParams = await params
			const number = parseInt(resolvedParams.number, 10)
			if (isNaN(number) || number < 1) {
				router.push('/')
				return
			}
			setAdventureNumber(number)
		}
		loadParams()
	}, [params, router])

	// Fetch adventure data
	useEffect(() => {
		if (!adventureNumber) return

		const fetchAdventure = async () => {
			setIsLoading(true)
			try {
				const response = await fetch(`/api/adventure/${adventureNumber}`)
				if (!response.ok) {
					throw new Error('Failed to fetch adventure')
				}
				const data: AdventureResponse = await response.json()
				setAdventure(data.data)

				// Load or create adventure run
				let run = loadAdventureProgress(data.data.adventure.adventureNumber)
				if (!run) {
					run = {
						adventureNumber: data.data.adventure.adventureNumber,
						date: data.data.adventure.featuredDate,
						seed: data.data.adventure.seed,
						startTime: Date.now(),
						riddles: data.data.riddles.map((riddle) => ({
							riddleId: riddle.postId,
							attempts: 0,
							solved: false,
							startTime: Date.now(),
						})),
					}
					saveAdventureProgress(run)
				} else {
					// Find the first unsolved riddle
					const firstUnsolvedIndex = run.riddles.findIndex((r) => !r.solved)
					if (firstUnsolvedIndex !== -1) {
						setCurrentRiddleIndex(firstUnsolvedIndex)
					} else {
						// All solved, show end screen
						if (run.endTime) {
							setShowEndScreen(true)
						} else {
							// Mark as completed if not already
							run.endTime = Date.now()
							saveAdventureProgress(run)
							setShowEndScreen(true)
						}
					}
				}
				setAdventureRun(run)
			} catch (error) {
				console.error('Error fetching adventure:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchAdventure()
	}, [adventureNumber])

	// Update current riddle start time when index changes
	useEffect(() => {
		if (
			adventureRun &&
			adventureRun.riddles[currentRiddleIndex] &&
			!adventureRun.riddles[currentRiddleIndex].solved
		) {
			const updatedRun = { ...adventureRun }
			if (!updatedRun.riddles[currentRiddleIndex].startTime) {
				updatedRun.riddles[currentRiddleIndex].startTime = Date.now()
				setAdventureRun(updatedRun)
				saveAdventureProgress(updatedRun)
			}
		}
	}, [currentRiddleIndex, adventureRun])

	const checkAnswer = () => {
		if (!answer.trim() || !adventure || !adventureRun) return

		const currentRiddle = adventure.riddles[currentRiddleIndex]
		const normalizedAnswer = answer.trim().toLowerCase()
		const correctAnswer = currentRiddle.word.toLowerCase()
		const altAnswers = currentRiddle.altwords
			? currentRiddle.altwords.split(',').map((w) => w.trim().toLowerCase())
			: []

		const isCorrect = normalizedAnswer === correctAnswer || altAnswers.some((alt) => normalizedAnswer === alt)

		const updatedRun = { ...adventureRun }
		const riddleRun = updatedRun.riddles[currentRiddleIndex]
		riddleRun.attempts += 1

		if (isCorrect) {
			riddleRun.solved = true
			riddleRun.solveTime = Date.now() - riddleRun.startTime
			setFeedback('correct')
			setAdventureRun(updatedRun)
			saveAdventureProgress(updatedRun)

			// Check if this is the last riddle
			if (currentRiddleIndex === adventure.riddles.length - 1) {
				updatedRun.endTime = Date.now()
				saveAdventureProgress(updatedRun)
				setTimeout(() => {
					setShowEndScreen(true)
				}, 1500)
			} else {
				// Show transition screen
				setTimeout(() => {
					setShowTransition(true)
				}, 1500)
			}
		} else {
			setFeedback('incorrect')
		}
	}

	const handleContinue = () => {
		setShowTransition(false)
		setCurrentRiddleIndex((prev) => prev + 1)
		setAnswer('')
		setFeedback(null)
	}

	const handleAnswerChange = (newAnswer: string) => {
		setAnswer(newAnswer)
		if (feedback === 'incorrect') {
			setFeedback(null)
		}
	}

	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000)
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const getShareCardData = () => {
		if (!adventureRun || !adventure) return null

		const totalTime = adventureRun.endTime
			? adventureRun.endTime - adventureRun.startTime
			: Date.now() - adventureRun.startTime
		const totalAttempts = adventureRun.riddles.reduce((sum, r) => sum + r.attempts, 0)
		const solvedCount = adventureRun.riddles.filter((r) => r.solved).length

		// Find fastest and slowest riddles
		const solvedRiddles = adventureRun.riddles.filter(
			(r): r is RiddleRun & { solveTime: number } => r.solved === true && r.solveTime !== undefined
		)
		const fastest = solvedRiddles.reduce(
			(min, r) => (!min || r.solveTime < min.solveTime ? r : min),
			null as (RiddleRun & { solveTime: number }) | null
		)
		const slowest = solvedRiddles.reduce(
			(max, r) => (!max || r.solveTime > max.solveTime ? r : max),
			null as (RiddleRun & { solveTime: number }) | null
		)

		// Generate visual trace
		const trace = adventureRun.riddles.map((r) => {
			if (r.attempts === 1) return '🟩'
			if (r.attempts >= 2 && r.attempts <= 3) return '🟨'
			return '🟥'
		})

		// Generate flavor line
		const perfectCount = adventureRun.riddles.filter((r) => r.attempts === 1).length
		const cleanCount = adventureRun.riddles.filter((r) => r.attempts >= 2 && r.attempts <= 3).length
		const gritCount = adventureRun.riddles.filter((r) => r.attempts >= 4).length

		let flavorLine = 'Methodical. Unrushed. Effective.'
		if (perfectCount >= 4) {
			flavorLine = 'Sharp Thinker. Quick and precise.'
		} else if (gritCount >= 4) {
			flavorLine = 'Relentless Mind. Never gives up.'
		} else if (cleanCount >= 4) {
			flavorLine = 'Steady Solver. Consistent and thoughtful.'
		}

		return {
			adventureNumber: adventureRun.adventureNumber,
			totalTime,
			totalAttempts,
			solvedCount,
			fastest: fastest ? adventure.riddles.findIndex((r) => r.postId === fastest.riddleId) + 1 : null,
			slowest: slowest ? adventure.riddles.findIndex((r) => r.postId === slowest.riddleId) + 1 : null,
			trace,
			flavorLine,
		}
	}

	if (isLoading || !adventure || !adventureRun) {
		return (
			<>
				<GoogleAdVerticalFixed />
				<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
					<p className="text-xl">Loading adventure...</p>
				</div>
			</>
		)
	}

	const currentRiddle = adventure.riddles[currentRiddleIndex]
	const shareData = getShareCardData()

	// Transition screen
	if (showTransition) {
		const transitionMessages = [
			'That one was deceptive.',
			'You saw through it quickly.',
			'Well reasoned.',
			'Nicely done.',
			'Keep going!',
		]
		const message = transitionMessages[currentRiddleIndex % transitionMessages.length]

		return (
			<>
				<GoogleAdVerticalFixed />
				<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
					<div className="flex flex-col items-center gap-6">
						<p className="text-2xl md:text-3xl text-center">{message}</p>
						<BasicButton text="Continue" onClick={handleContinue} customClass="px-8 py-3" />
					</div>
				</div>
			</>
		)
	}

	// End screen
	if (showEndScreen && shareData) {
		return (
			<>
				<GoogleAdVerticalFixed />
				<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
					<div className="w-full max-w-2xl flex flex-col gap-6">
						<h1 className="text-3xl md:text-4xl text-center">You completed today&apos;s adventure!</h1>

						<div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-4">
							<div className="text-center">
								<h2 className="text-xl mb-2">Riddonkulous — Daily Adventure</h2>
								<p className="text-2xl font-bold">#{shareData.adventureNumber}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<p className="text-3xl font-bold">🧠</p>
									<p className="text-sm text-gray-400">Riddles</p>
									<p className="text-xl font-semibold">
										{shareData.solvedCount}/{adventure.riddles.length}
									</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold">⏱</p>
									<p className="text-sm text-gray-400">Total Time</p>
									<p className="text-xl font-semibold">{formatTime(shareData.totalTime)}</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold">🎯</p>
									<p className="text-sm text-gray-400">Attempts</p>
									<p className="text-xl font-semibold">{shareData.totalAttempts}</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold">⚡</p>
									<p className="text-sm text-gray-400">Fastest</p>
									<p className="text-xl font-semibold">
										{shareData.fastest ? `Riddle ${shareData.fastest}` : '—'}
									</p>
								</div>
							</div>

							<div className="text-center">
								<p className="text-sm text-gray-400 mb-2">Visual Trace</p>
								<p className="text-2xl">{shareData.trace.join(' ')}</p>
							</div>

							<div className="text-center">
								<p className="text-lg italic">{shareData.flavorLine}</p>
							</div>

							<div className="flex justify-center">
								<BasicButton
									text="Share Results"
									onClick={() => setIsShareModalOpen(true)}
									customClass="px-6 py-3"
								/>
							</div>
						</div>
					</div>

					<BottomSheetModal
						isOpen={isShareModalOpen}
						onClose={() => setIsShareModalOpen(false)}
						title="Share Adventure Results"
						icon="/icons/world.png"
					>
						<AdventureShareModal
							url={`${typeof window !== 'undefined' ? window.location.origin : ''}/riddle/adventure/${shareData.adventureNumber}`}
							title={`Riddonkulous — Daily Adventure #${shareData.adventureNumber}`}
							text={`🧠 Riddles: ${shareData.solvedCount}/${adventure.riddles.length}
⏱ Total Time: ${formatTime(shareData.totalTime)}
🎯 Attempts: ${shareData.totalAttempts}
⚡ Fastest: ${shareData.fastest ? `Riddle ${shareData.fastest}` : '—'}

Visual Trace:
${shareData.trace.join(' ')}

${shareData.flavorLine}

Try today's adventure at riddonkulous.com`}
							onClose={() => setIsShareModalOpen(false)}
						/>
					</BottomSheetModal>
				</div>
			</>
		)
	}

	// Main riddle solving screen
	return (
		<>
			<GoogleAdVerticalFixed />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8 gap-6">
				<GoogleAdDisplayUnitHorizontal />
				<GoogleAdMobileBanner customClasses="mt-[-32px] mb-2" />

				{/* Header */}
				<div className="w-full flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<Image src="/icons/light.png" alt="Adventure" width={32} height={32} className="w-8 h-8" />
						<h1 className="text-2xl md:text-4xl">Daily Adventure #{adventure.adventure.adventureNumber}</h1>
					</div>
					<div className="text-sm text-gray-400">
						Riddle {currentRiddleIndex + 1} of {adventure.riddles.length}
					</div>
				</div>

				{/* Riddle Card */}
				<div className="w-full">
					<RiddleCard riddle={currentRiddle} className="lg:h-[400px]" hideSolveButton={true} />
				</div>

				{/* Answer Input */}
				<div className="w-full flex flex-col gap-4">
					<LetterRearrangeInput
						word={currentRiddle.word}
						onAnswerChange={handleAnswerChange}
						disabled={adventureRun.riddles[currentRiddleIndex].solved}
					/>

					<BasicButton
						text={adventureRun.riddles[currentRiddleIndex].solved ? 'Solved!' : 'Check Answer'}
						onClick={checkAnswer}
						customClass={`w-full py-3 ${adventureRun.riddles[currentRiddleIndex].solved ? 'opacity-60 cursor-not-allowed' : ''}`}
						disabled={adventureRun.riddles[currentRiddleIndex].solved || !answer.trim()}
					/>

					{feedback === 'correct' && <p className="text-green-600 text-center">🎉 Correct! Well done!</p>}
					{feedback === 'incorrect' && <p className="text-red-600 text-center">❌ Incorrect. Try again!</p>}
				</div>
			</div>
		</>
	)
}
