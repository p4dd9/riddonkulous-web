'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LetterItem {
	id: string
	letter: string
	isSelected: boolean
}

interface LetterRearrangeInputProps {
	word: string
	onAnswerChange: (answer: string) => void
	disabled?: boolean
	isIncorrect?: boolean
}

export const LetterRearrangeInput = ({
	word,
	onAnswerChange,
	disabled = false,
	isIncorrect = false,
}: LetterRearrangeInputProps) => {
	const [letters, setLetters] = useState<LetterItem[]>([])
	const [selectedLetters, setSelectedLetters] = useState<LetterItem[]>([])
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		// Shuffle the letters initially
		const letterArray = word.toLowerCase().split('')
		const shuffled = [...letterArray].sort(() => Math.random() - 0.5)
		const letterItems: LetterItem[] = shuffled.map((letter, index) => ({
			id: `${letter}-${index}-${Date.now()}`,
			letter,
			isSelected: false,
		}))
		setLetters(letterItems)
		setSelectedLetters([])
		onAnswerChange('')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [word])

	const handleLetterClick = (id: string) => {
		if (disabled) return

		// Find the clicked letter
		const clickedLetter = letters.find((item) => item.id === id)
		if (!clickedLetter || clickedLetter.isSelected) return

		// Mark as selected and add to selectedLetters in click order
		setLetters((prev) => prev.map((item) => (item.id === id ? { ...item, isSelected: true } : item)))
		const newSelected = [...selectedLetters, clickedLetter]
		setSelectedLetters(newSelected)
		onAnswerChange(newSelected.map((item) => item.letter).join(''))
	}

	const handleSelectedLetterClick = (id: string) => {
		if (disabled) return

		// Remove from selectedLetters array (maintains click order)
		const newSelected = selectedLetters.filter((item) => item.id !== id)
		setSelectedLetters(newSelected)
		setLetters((prev) => prev.map((item) => (item.id === id ? { ...item, isSelected: false } : item)))
		onAnswerChange(newSelected.map((item) => item.letter).join(''))
	}

	const handleShuffle = () => {
		if (disabled) return

		// Shuffle all letters (both selected and available)
		const allLetters = [...letters].sort(() => Math.random() - 0.5)
		// Reset selection when shuffling
		const resetLetters = allLetters.map((item) => ({ ...item, isSelected: false }))
		setLetters(resetLetters)
		setSelectedLetters([])
		onAnswerChange('')
	}

	const handleClear = () => {
		if (disabled) return

		const allLetters = letters.map((item) => ({ ...item, isSelected: false }))
		setLetters(allLetters)
		setSelectedLetters([])
		onAnswerChange('')
	}

	// Handle incorrect answer animation
	useEffect(() => {
		if (isIncorrect && selectedLetters.length > 0) {
			setIsAnimating(true)
			// After 1 second, reset letters and clear selection (without shuffling)
			const timer = setTimeout(() => {
				const allLetters = letters.map((item) => ({ ...item, isSelected: false }))
				setLetters(allLetters)
				setSelectedLetters([])
				onAnswerChange('')
				setIsAnimating(false)
			}, 1000)
			return () => clearTimeout(timer)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isIncorrect])

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Selected letters (answer being built) - fixed height to prevent layout shift */}
			<div className="w-full min-h-[80px] p-4 bg-gray-800 rounded-lg border-2 border-gray-600 flex flex-wrap items-center justify-center gap-2 overflow-hidden">
				{selectedLetters.length === 0 ? (
					<span className="text-gray-500 text-sm text-center">Tap letters below to build your answer</span>
				) : (
					selectedLetters.map((item) => (
						<button
							key={item.id}
							onClick={() => handleSelectedLetterClick(item.id)}
							disabled={disabled || isAnimating}
							className={`px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
								isAnimating ? 'letter-slide-back' : ''
							}`}
						>
							{item.letter.toUpperCase()}
						</button>
					))
				)}
			</div>

			{/* Available letters - maintain positions for sticky layout */}
			<div className="w-full flex flex-wrap gap-2 justify-center">
				{letters.map((item) => (
					<button
						key={item.id}
						onClick={() => handleLetterClick(item.id)}
						disabled={disabled || item.isSelected}
						className={`px-4 py-2 text-white rounded-md text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
							item.isSelected
								? 'bg-transparent cursor-default invisible'
								: 'bg-gray-700 hover:bg-gray-600'
						}`}
					>
						{item.letter.toUpperCase()}
					</button>
				))}
			</div>

			{/* Action buttons - always in layout to prevent jumping */}
			<div className="w-full flex gap-2">
				<button
					onClick={handleShuffle}
					disabled={disabled || letters.length === 0}
					className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					<Image src="/icons/arrow_refresh.png" alt="Shuffle" width={20} height={20} className="w-5 h-5" />
					<span>Shuffle</span>
				</button>
				<button
					onClick={handleClear}
					disabled={disabled || selectedLetters.length === 0}
					className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					<Image src="/icons/clear.png" alt="Clear" width={20} height={20} className="w-5 h-5" />
					<span>Clear</span>
				</button>
			</div>
		</div>
	)
}
