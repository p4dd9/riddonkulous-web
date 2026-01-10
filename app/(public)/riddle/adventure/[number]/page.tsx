'use client'

import { GoogleAdCategoryGrid } from '@/app/components/ads/GoogleAdCategoryGrid'
import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { BasicButton } from '@/app/components/buttons/BasicButton'
import { AdventureShareModal } from '@/app/components/modals/AdventureShareModal'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { ClassicTextInput } from '@/app/components/riddles/ClassicTextInput'
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

	const handleStartAdventure = () => {
		if (!adventureRun) return
		// Set start time and save
		const run = {
			...adventureRun,
			startTime: Date.now(),
			riddles: adventureRun.riddles.map((r) => ({
				...r,
				startTime: Date.now(),
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
						<Image src="/icons/light.png" alt="Adventure" width={32} height={32} className="w-8 h-8" />
						<h1 className="text-2xl md:text-4xl">
							Daily Riddle Adventure #{adventure.adventure.adventureNumber}
						</h1>
					</div>
					<div className="text-sm text-gray-400">
						Riddle {currentRiddleIndex + 1} of {adventure.riddles.length}
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

					<BasicButton
						text={adventureRun.riddles[currentRiddleIndex].solved ? 'Solved!' : 'Check Answer'}
						onClick={checkAnswer}
						customClass={`w-full py-3 ${adventureRun.riddles[currentRiddleIndex].solved ? 'opacity-60 cursor-not-allowed' : ''}`}
						disabled={adventureRun.riddles[currentRiddleIndex].solved || !answer.trim()}
					/>

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
			</div>
		</>
	)
}
