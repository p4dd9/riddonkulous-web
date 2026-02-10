'use client'

import { GoogleAdCategoryGrid } from '@/app/components/ads/GoogleAdCategoryGrid'
import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { BasicButton } from '@/app/components/buttons/BasicButton'
import { AdventureShareModal } from '@/app/components/modals/AdventureShareModal'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { HintModal } from '@/app/components/modals/HintModal'
import { ClassicTextInput } from '@/app/components/riddles/ClassicTextInput'
import { LetterRearrangeInput } from '@/app/components/riddles/LetterRearrangeInput'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { ShareButton } from '@/app/components/ShareButton'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
const MODE_STORAGE_KEY = 'riddonkulous-adventure-mode'

const getStorageKey = (adventureNumber: number) => `${STORAGE_KEY_PREFIX}${adventureNumber}`

type RiddleMode = 'liddle' | 'riddle'

const loadMode = (): RiddleMode => {
	if (typeof window === 'undefined') return 'liddle'
	try {
		const stored = localStorage.getItem(MODE_STORAGE_KEY)
		return (stored === 'riddle' ? 'riddle' : 'liddle') as RiddleMode
	} catch {
		return 'liddle'
	}
}

const saveMode = (mode: RiddleMode) => {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(MODE_STORAGE_KEY, mode)
	} catch (error) {
		console.error('Failed to save mode:', error)
	}
}

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
	const searchParams = useSearchParams()
	const isDevelopment = searchParams.get('debug') === 'true'
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
	const [showWelcomeScreen, setShowWelcomeScreen] = useState(false)
	const [riddleMode, setRiddleMode] = useState<RiddleMode>('liddle')
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
	const [isHintModalOpen, setIsHintModalOpen] = useState(false)
	const [suggestedAdventures, setSuggestedAdventures] = useState<
		{
			adventureNumber: number
			featuredDate: string
			seed: string
			postIds: string[]
		}[]
	>([])
	const [loadingSuggestions, setLoadingSuggestions] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Load mode preference
	useEffect(() => {
		setRiddleMode(loadMode())
	}, [])

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
			setError(null)
			try {
				const response = await fetch(`/api/adventure/${adventureNumber}`)
				if (!response.ok) {
					if (response.status === 404) {
						setError('notFound')
					} else {
						setError('failed')
					}
					setIsLoading(false)
					return
				}
				const data: AdventureResponse = await response.json()
				setAdventure(data.data)

				// Load or create adventure run
				let run = loadAdventureProgress(data.data.adventure.adventureNumber)
				if (!run) {
					// First time - show welcome screen
					setShowWelcomeScreen(true)
					// Create run but don't save yet (will save when they start)
					run = {
						adventureNumber: data.data.adventure.adventureNumber,
						date: data.data.adventure.featuredDate,
						seed: data.data.adventure.seed,
						startTime: 0, // Will be set when they start
						riddles: data.data.riddles.map((riddle) => ({
							riddleId: riddle.postId,
							attempts: 0,
							solved: false,
							startTime: 0,
						})),
					}
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
				setError('failed')
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
			!adventureRun.riddles[currentRiddleIndex].solved &&
			adventureRun.startTime > 0 // Only set if adventure has started
		) {
			const currentRiddle = adventureRun.riddles[currentRiddleIndex]
			// Only set startTime if it's 0 (not yet started) or undefined
			if (currentRiddle.startTime === 0 || currentRiddle.startTime === undefined) {
				const updatedRun = { ...adventureRun }
				updatedRun.riddles[currentRiddleIndex] = {
					...currentRiddle,
					startTime: Date.now(),
				}
				setAdventureRun(updatedRun)
				saveAdventureProgress(updatedRun)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentRiddleIndex]) // Only depend on currentRiddleIndex, not adventureRun

	// Collect all solved postIds from completed adventures
	const getAllSolvedPostIds = useCallback((): string[] => {
		if (typeof window === 'undefined') return []

		const solvedPostIds = new Set<string>()

		// Check all stored adventures (go back up to 50 to find completed ones)
		const currentAdventureNumber = adventureRun?.adventureNumber || 0
		for (let i = 0; i <= 50; i++) {
			const adventureNum = currentAdventureNumber - i
			if (adventureNum <= 0) break

			const run = loadAdventureProgress(adventureNum)
			if (run?.endTime && run.endTime > 0) {
				// Adventure is completed, add all its riddle postIds
				run.riddles.forEach((riddle) => {
					if (riddle.solved && riddle.riddleId) {
						solvedPostIds.add(riddle.riddleId)
					}
				})
			}
		}

		return Array.from(solvedPostIds)
	}, [adventureRun])

	// Fetch suggested adventures when end screen is shown
	useEffect(() => {
		if (!showEndScreen || !adventure || !adventureRun) return

		const fetchSuggestedAdventures = async () => {
			setLoadingSuggestions(true)

			try {
				// Collect all solved postIds from completed adventures
				const solvedPostIds = getAllSolvedPostIds()

				if (solvedPostIds.length === 0) {
					setSuggestedAdventures([])
					setLoadingSuggestions(false)
					return
				}

				// Call the recommendations API
				const response = await fetch('/api/adventure/recommendations', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						solvedPostIds,
						limit: 3,
					}),
				})

				if (!response.ok) {
					throw new Error('Failed to fetch recommendations')
				}

				const data = await response.json()
				if (data.status === 'success' && data.data?.recommendations) {
					// Filter out the current adventure from recommendations
					const filtered = data.data.recommendations.filter(
						(rec: { adventureNumber: number }) => rec.adventureNumber !== adventureRun.adventureNumber
					)
					setSuggestedAdventures(filtered.slice(0, 3))
				} else {
					setSuggestedAdventures([])
				}
			} catch (error) {
				console.error('Error fetching recommendations:', error)
				setSuggestedAdventures([])
			} finally {
				setLoadingSuggestions(false)
			}
		}

		fetchSuggestedAdventures()
	}, [showEndScreen, adventure, adventureRun, getAllSolvedPostIds])

	const checkAnswer = (answerToCheck?: string) => {
		const answerValue = answerToCheck ?? answer
		if (!answerValue.trim() || !adventure || !adventureRun) return

		const currentRiddle = adventure.riddles[currentRiddleIndex]
		const normalizedAnswer = answerValue.trim().toLowerCase()
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
			// Ensure startTime is valid before calculating solveTime
			const validStartTime = riddleRun.startTime > 0 ? riddleRun.startTime : Date.now()
			riddleRun.solveTime = Date.now() - validStartTime
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

	const handleAutoSolve = () => {
		if (!adventure || !adventureRun || adventureRun.riddles[currentRiddleIndex].solved) return

		const currentRiddle = adventure.riddles[currentRiddleIndex]
		const correctAnswer = currentRiddle.word

		// Set the answer state - this works for both riddle and liddle modes
		// For liddle mode, the visual component might not update, but the answer state will be correct
		setAnswer(correctAnswer)
		handleAnswerChange(correctAnswer)

		// Check answer directly with the correct answer to avoid state timing issues
		setTimeout(() => {
			checkAnswer(correctAnswer)
		}, 50)
	}

	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000)
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const getShareCardData = () => {
		if (!adventureRun || !adventure) return null

		// Ensure startTime is valid before calculating total time
		const validStartTime = adventureRun.startTime > 0 ? adventureRun.startTime : Date.now()
		const totalTime = adventureRun.endTime ? adventureRun.endTime - validStartTime : Date.now() - validStartTime
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

		// Generate perfection score
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

	if (isLoading || !adventure || !adventureRun || error) {
		return (
			<>
				<GoogleAdVerticalFixed />
				<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
					{error === 'notFound' ? (
						<div className="flex flex-col items-center gap-4 text-center">
							<h1 className="text-3xl md:text-4xl font-bold">Adventure Not Found</h1>
							<p className="text-lg text-gray-400">
								Adventure #{adventureNumber} doesn&apos;t exist yet.
							</p>
							<div className="flex flex-col gap-3 mt-4">
								<BasicButton
									text="Go to Current Adventure"
									onClick={() => router.push('/riddle/adventure')}
									customClass="px-6 py-3"
								/>
								<BasicButton
									text="Go Home"
									onClick={() => router.push('/')}
									customClass="px-6 py-3"
									variant="secondary"
								/>
							</div>
						</div>
					) : error === 'failed' ? (
						<div className="flex flex-col items-center gap-4 text-center">
							<h1 className="text-3xl md:text-4xl font-bold">Failed to Load Adventure</h1>
							<p className="text-lg text-gray-400">Something went wrong while loading the adventure.</p>
							<div className="flex flex-col gap-3 mt-4">
								<BasicButton
									text="Try Again"
									onClick={() => {
										setError(null)
										setIsLoading(true)
										// Reload the page to retry fetching
										window.location.reload()
									}}
									customClass="px-6 py-3"
								/>
								<BasicButton
									text="Go Home"
									onClick={() => router.push('/')}
									customClass="px-6 py-3"
									variant="secondary"
								/>
							</div>
						</div>
					) : (
						<p className="text-xl">Loading adventure...</p>
					)}
				</div>
			</>
		)
	}

	const handleStartAdventure = () => {
		if (!adventureRun) return
		// Set adventure start time and first riddle start time
		const now = Date.now()
		const run = {
			...adventureRun,
			startTime: now,
			riddles: adventureRun.riddles.map((r, index) => ({
				...r,
				// Only set startTime for the first riddle, others will be set when user reaches them
				startTime: index === 0 ? now : 0,
			})),
		}

		saveAdventureProgress(run)
		setAdventureRun(run)
		setShowWelcomeScreen(false)
	}

	const handleModeChange = (mode: RiddleMode) => {
		setRiddleMode(mode)
		saveMode(mode)
		setIsSettingsModalOpen(false)
	}

	const handleReplay = () => {
		if (!adventure || !adventureNumber) return
		// Clear progress
		localStorage.removeItem(getStorageKey(adventureNumber))
		// Reset state
		const newRun: AdventureRun = {
			adventureNumber: adventure.adventure.adventureNumber,
			date: adventure.adventure.featuredDate,
			seed: adventure.adventure.seed,
			startTime: 0,
			riddles: adventure.riddles.map((riddle) => ({
				riddleId: riddle.postId,
				attempts: 0,
				solved: false,
				startTime: 0,
			})),
		}
		setAdventureRun(newRun)
		setCurrentRiddleIndex(0)
		setAnswer('')
		setFeedback(null)
		setShowEndScreen(false)
		setShowWelcomeScreen(true)
	}

	const currentRiddle = adventure.riddles[currentRiddleIndex]
	const shareData = getShareCardData()

	// Welcome screen
	if (showWelcomeScreen) {
		return (
			<>
				<GoogleAdVerticalFixed />
				<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
					<div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
						<Image
							src="/pals/PAL055.gif"
							alt="Adventure Pal"
							width={256}
							height={256}
							className="w-32 h-32 md:w-48 md:h-48 shrink-0"
							unoptimized
						/>
						<div className="flex flex-col items-center md:items-start gap-4 flex-1">
							<h1 className="text-3xl md:text-4xl ">Daily Riddle Adventure</h1>
							<div className="flex flex-col gap-4 text-lg">
								<p>7 riddles. One journey. Your daily challenge.</p>
								<p className="text-gray-400 text-base">
									Time is tracked, but there&apos;s no pressure. Just you and the puzzle.
								</p>
							</div>
							{/* Mode Selection */}
							<div className="w-full flex flex-col gap-3">
								<p className="text-sm text-gray-400">Choose your solving mode:</p>
								<div className="flex gap-3">
									<button
										onClick={() => handleModeChange('liddle')}
										className={`flex-1 px-4 py-3 rounded-md border-2 transition-all flex flex-col items-center gap-2 ${
											riddleMode === 'liddle'
												? 'bg-primary border-primary text-white shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px]'
												: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 opacity-60'
										}`}
									>
										<Image
											src="/icons/font.png"
											alt=""
											width={24}
											height={24}
											className="w-6 h-6"
										/>
										<div className="text-base">Liddle Mode</div>
										<div className="text-xs opacity-80">Rearrange letters</div>
									</button>
									<button
										onClick={() => handleModeChange('riddle')}
										className={`flex-1 px-4 py-3 rounded-md border-2 transition-all flex flex-col items-center gap-2 ${
											riddleMode === 'riddle'
												? 'bg-primary border-primary text-white shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px]'
												: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 opacity-60'
										}`}
									>
										<Image
											src="/icons/pencil.png"
											alt=""
											width={24}
											height={24}
											className="w-6 h-6"
										/>
										<div className="text-base">Riddle Mode</div>
										<div className="text-xs opacity-80">Type your answer</div>
									</button>
								</div>
								<p className="text-xs text-gray-500">
									You can switch modes anytime during the adventure
								</p>
							</div>
							<BasicButton
								text="Start Adventure"
								onClick={handleStartAdventure}
								customClass="px-8 py-3 text-lg"
							/>
						</div>
					</div>
				</div>
			</>
		)
	}

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

		// Random pal image (PAL001.gif to PAL009.gif) based on riddle index for consistency
		const palNumber = String((currentRiddleIndex % 9) + 1).padStart(3, '0')
		const palImage = `/pals/PAL${palNumber}.gif`

		return (
			<>
				<GoogleAdVerticalFixed />
				<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
					<div className="flex flex-col items-center gap-6">
						<Image src={palImage} alt="Pal" width={128} height={128} className="w-32 h-32" unoptimized />
						<p className="text-2xl md:text-3xl text-center">{message}</p>
						{/* Category grid for screens >= 330px */}
						<div className="w-full max-w-xs hidden min-[330px]:block">
							<GoogleAdCategoryGrid />
						</div>
						{/* Mobile banner for screens < 330px */}
						<div className="w-full max-w-xs block min-[330px]:hidden">
							<GoogleAdMobileBanner />
						</div>
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
								<h2 className="text-xl mb-2">
									Riddonkulous Daily Riddle Adventure #{shareData.adventureNumber}
								</h2>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<div className="flex justify-center mb-2">
										<Image
											src="/icons/bulb.png"
											alt="Riddles"
											width={32}
											height={32}
											className="w-8 h-8"
										/>
									</div>
									<p className="text-sm text-gray-400">Riddles</p>
									<p className="text-xl font-semibold">
										{shareData.solvedCount}/{adventure.riddles.length}
									</p>
								</div>
								<div className="text-center">
									<div className="flex justify-center mb-2">
										<Image
											src="/icons/clock.png"
											alt="Total Time"
											width={32}
											height={32}
											className="w-8 h-8"
										/>
									</div>
									<p className="text-sm text-gray-400">Total Time</p>
									<p className="text-xl font-semibold">{formatTime(shareData.totalTime)}</p>
								</div>
								<div className="text-center">
									<div className="flex justify-center mb-2">
										<Image
											src="/icons/crosshair.png"
											alt="Attempts"
											width={32}
											height={32}
											className="w-8 h-8"
										/>
									</div>
									<p className="text-sm text-gray-400">Attempts</p>
									<p className="text-xl font-semibold">{shareData.totalAttempts}</p>
								</div>
								<div className="text-center">
									<div className="flex justify-center mb-2">
										<Image
											src="/icons/arrow_speed.png"
											alt="Fastest"
											width={32}
											height={32}
											className="w-8 h-8"
										/>
									</div>
									<p className="text-sm text-gray-400">Fastest</p>
									<p className="text-xl font-semibold">
										{shareData.fastest ? `Riddle ${shareData.fastest}` : '—'}
									</p>
								</div>
							</div>

							<div className="text-center">
								<p className="text-sm text-gray-400 mb-2">Perfection Score</p>
								<p className="text-2xl">{shareData.trace.join(' ')}</p>
							</div>

							<div className="text-center">
								<p className="text-lg italic">{shareData.flavorLine}</p>
							</div>

							<div className="flex flex-col gap-3">
								<BasicButton
									text="Share Results"
									onClick={() => setIsShareModalOpen(true)}
									customClass="px-6 py-3"
								/>
								<BasicButton
									text="Replay Adventure"
									onClick={handleReplay}
									customClass="px-6 py-3"
									variant="secondary"
								/>
							</div>
						</div>

						{/* Discovery Section */}
						{loadingSuggestions ? (
							<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
								<p className="text-sm text-gray-400 text-center">Finding adventures for you...</p>
							</div>
						) : suggestedAdventures.length > 0 ? (
							<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
								<div className="flex items-center gap-2 mb-3">
									<Image
										src="/icons/item.png"
										alt="Discover"
										width={24}
										height={24}
										className="w-6 h-6"
									/>
									<h3 className="text-xl font-semibold text-white">Discover More Adventures</h3>
								</div>
								<p className="text-sm text-gray-400 mb-4">
									Try these adventures you haven&apos;t completed yet:
								</p>
								<div className="flex flex-col gap-2">
									{suggestedAdventures.map((recommendedAdventure) => (
										<Link
											key={recommendedAdventure.adventureNumber}
											href={`/riddle/adventure/${recommendedAdventure.adventureNumber}`}
											className="flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
										>
											<span className="text-white font-medium">
												Adventure #{recommendedAdventure.adventureNumber}
											</span>
											<Image
												src="/icons/arrow_right.png"
												alt="Go"
												width={16}
												height={16}
												className="w-4 h-4 opacity-60"
											/>
										</Link>
									))}
								</div>
							</div>
						) : null}
					</div>

					<BottomSheetModal
						isOpen={isShareModalOpen}
						onClose={() => setIsShareModalOpen(false)}
						title="Share Adventure Results"
						icon="/icons/world.png"
					>
						<AdventureShareModal
							url={`${typeof window !== 'undefined' ? window.location.origin : ''}/riddle/adventure/${shareData.adventureNumber}`}
							title={`Riddonkulous Daily Riddle Adventure #${shareData.adventureNumber}`}
							text={`Riddles: ${shareData.solvedCount}/${adventure.riddles.length}
Total Time: ${formatTime(shareData.totalTime)}
Attempts: ${shareData.totalAttempts}
Fastest: ${shareData.fastest ? `Riddle ${shareData.fastest}` : '—'}

Perfection Score:
${shareData.trace
	.map((emoji) => {
		if (emoji === '🟩') return '[1]'
		if (emoji === '🟨') return '[2-3]'
		if (emoji === '🟥') return '[4+]'
		return emoji
	})
	.join(' ')}

${shareData.flavorLine}

Can you beat my score?`}
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
						<Image src="/icons/item.png" alt="Adventure" width={32} height={32} className="w-8 h-8" />
						<h1 className="text-2xl md:text-4xl">
							Daily Riddle Adventure #{adventure.adventure.adventureNumber}
						</h1>
					</div>
					<div className="flex items-center justify-between flex-wrap gap-2">
						<div className="text-sm text-gray-400">
							Riddle {currentRiddleIndex + 1} of {adventure.riddles.length}
						</div>
						{isDevelopment && riddleMode === 'liddle' && (
							<div className="flex items-center gap-2">
								<span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-700">
									DEV: Answer = &quot;{currentRiddle.word}&quot;
								</span>
							</div>
						)}
						{adventureNumber && (
							<ShareButton
								url={`${typeof window !== 'undefined' ? window.location.origin : ''}/riddle/adventure/${adventureNumber}`}
								title={`Riddonkulous Daily Riddle Adventure #${adventureNumber}`}
								iconOnly
							/>
						)}
					</div>
				</div>

				{/* Riddle Card */}
				<div className="w-full relative">
					{/* Total guesses counter - moved to left */}
					<div className="absolute top-2 left-2 z-20 px-3 py-1.5">
						<div className="flex items-center gap-2">
							<span className="text-sm font-semibold">
								{adventureRun.riddles.reduce((sum, r) => sum + r.attempts, 0)} guesses
							</span>
						</div>
					</div>
					{/* Settings button - top right */}
					<button
						onClick={() => setIsSettingsModalOpen(true)}
						className="absolute top-2 right-2 z-20 p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-md transition-colors"
						aria-label="Settings"
					>
						<Image
							src="/icons/settings_gear.png"
							alt="Settings"
							width={20}
							height={20}
							className="w-5 h-5"
						/>
					</button>
					<RiddleCard
						riddle={currentRiddle}
						className="lg:h-[400px]"
						hideSolveButton={true}
						hideStats={true}
						extraTopPadding={true}
					/>
				</div>

				{/* Answer Input */}
				<div className="w-full flex flex-col gap-4">
					{riddleMode === 'liddle' ? (
						<LetterRearrangeInput
							word={currentRiddle.word}
							onAnswerChange={handleAnswerChange}
							disabled={adventureRun.riddles[currentRiddleIndex].solved}
							isIncorrect={feedback === 'incorrect'}
						/>
					) : (
						<ClassicTextInput
							value={answer}
							onChange={handleAnswerChange}
							disabled={adventureRun.riddles[currentRiddleIndex].solved}
							isIncorrect={feedback === 'incorrect'}
						/>
					)}

					<div className="flex gap-3">
						<BasicButton
							text={adventureRun.riddles[currentRiddleIndex].solved ? 'Solved!' : 'Check Answer'}
							onClick={(e) => {
								e.preventDefault()
								checkAnswer()
							}}
							customClass={`flex-1 py-3 ${adventureRun.riddles[currentRiddleIndex].solved ? 'opacity-60 cursor-not-allowed' : ''}`}
							disabled={adventureRun.riddles[currentRiddleIndex].solved || !answer.trim()}
						/>
						{isDevelopment && !adventureRun.riddles[currentRiddleIndex].solved && (
							<BasicButton
								text="Auto-Solve"
								onClick={handleAutoSolve}
								customClass="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white"
								variant="secondary"
							/>
						)}
					</div>
					{riddleMode === 'riddle' &&
						adventureRun.riddles[currentRiddleIndex].attempts > 0 &&
						!adventureRun.riddles[currentRiddleIndex].solved && (
							<div className="w-full flex flex-col md:flex-row gap-2">
								<button
									onClick={() => setIsHintModalOpen(true)}
									className="flex items-center justify-center gap-2 px-3 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full md:w-auto"
									aria-label="Show hint"
								>
									<Image src="/icons/item.png" alt="Hint" width={20} height={20} className="w-5 h-5" />
									<span className="text-sm">Show Hint</span>
								</button>
								{adventureNumber && (
									<ShareButton
										url={`${typeof window !== 'undefined' ? window.location.origin : ''}/riddle/adventure/${adventureNumber}`}
										title={`Riddonkulous Daily Riddle Adventure #${adventureNumber}`}
										buttonText="Ask Friend"
										modalTitle="Ask a friend for help"
										modalDescription="Ask a friend for help"
										icon="/icons/party.png"
										iconAlt="Ask Friend"
										className="w-full md:w-auto px-3 py-3"
									/>
								)}
							</div>
						)}

					{feedback === 'correct' && <p className="text-green-600 text-center">🎉 Correct! Well done!</p>}
					{feedback === 'incorrect' && <p className="text-red-600 text-center">❌ Incorrect. Try again!</p>}
				</div>

				{/* Settings Modal */}
				<BottomSheetModal
					isOpen={isSettingsModalOpen}
					onClose={() => setIsSettingsModalOpen(false)}
					title="Riddle Mode"
					icon="/icons/settings_gear.png"
				>
					<div className="flex flex-col gap-4">
						<p className="text-sm text-gray-400">Choose how you want to solve riddles:</p>
						<div className="flex flex-col gap-3">
							<button
								onClick={() => handleModeChange('liddle')}
								className={`w-full px-4 py-3 rounded-md border-2 transition-all flex flex-col items-start gap-2 ${
									riddleMode === 'liddle'
										? 'bg-primary border-primary text-white shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px]'
										: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 opacity-60'
								}`}
							>
								<div className="flex items-center gap-2">
									<Image src="/icons/font.png" alt="" width={20} height={20} className="w-5 h-5" />
									<div className="text-base">Liddle Mode</div>
								</div>
								<div className="text-xs opacity-80">Rearrange letters to build your answer</div>
							</button>
							<button
								onClick={() => handleModeChange('riddle')}
								className={`w-full px-4 py-3 rounded-md border-2 transition-all flex flex-col items-start gap-2 ${
									riddleMode === 'riddle'
										? 'bg-primary border-primary text-white shadow-[0_5px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[3px]'
										: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 opacity-60'
								}`}
							>
								<div className="flex items-center gap-2">
									<Image src="/icons/pencil.png" alt="" width={20} height={20} className="w-5 h-5" />
									<div className="text-base">Riddle Mode</div>
								</div>
								<div className="text-xs opacity-80">Type your answer directly</div>
							</button>
						</div>
					</div>
				</BottomSheetModal>

				{/* Hint Modal */}
				{adventure && (
					<BottomSheetModal
						isOpen={isHintModalOpen}
						onClose={() => setIsHintModalOpen(false)}
						title="Hint"
						icon="/icons/item.png"
					>
						<HintModal
							wordLength={adventure.riddles[currentRiddleIndex].word.length}
							onClose={() => setIsHintModalOpen(false)}
						/>
					</BottomSheetModal>
				)}
			</div>
		</>
	)
}
