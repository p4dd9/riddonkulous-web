'use client'

import { useEffect, useState } from 'react'

interface LetterRearrangeInputProps {
	word: string
	onAnswerChange: (answer: string) => void
	disabled?: boolean
}

export const LetterRearrangeInput = ({ word, onAnswerChange, disabled = false }: LetterRearrangeInputProps) => {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([])
	const [availableLetters, setAvailableLetters] = useState<string[]>([])

	useEffect(() => {
		// Shuffle the letters initially
		const letters = word.toLowerCase().split('')
		const shuffled = [...letters].sort(() => Math.random() - 0.5)
		setAvailableLetters(shuffled)
		setSelectedLetters([])
		onAnswerChange('')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [word])

	const handleLetterClick = (letter: string, index: number) => {
		if (disabled) return

		// Remove from available and add to selected
		const newAvailable = availableLetters.filter((_, i) => i !== index)
		const newSelected = [...selectedLetters, letter]
		setAvailableLetters(newAvailable)
		setSelectedLetters(newSelected)
		onAnswerChange(newSelected.join(''))
	}

	const handleSelectedLetterClick = (index: number) => {
		if (disabled) return

		// Remove from selected and add back to available
		const letter = selectedLetters[index]
		const newSelected = selectedLetters.filter((_, i) => i !== index)
		const newAvailable = [...availableLetters, letter]
		setSelectedLetters(newSelected)
		setAvailableLetters(newAvailable)
		onAnswerChange(newSelected.join(''))
	}

	const handleClear = () => {
		if (disabled) return

		const allLetters = [...selectedLetters, ...availableLetters]
		const shuffled = allLetters.sort(() => Math.random() - 0.5)
		setSelectedLetters([])
		setAvailableLetters(shuffled)
		onAnswerChange('')
	}

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Selected letters (answer being built) */}
			<div className="w-full min-h-[60px] p-4 bg-gray-800 rounded-lg border-2 border-gray-600 flex flex-wrap items-center gap-2">
				{selectedLetters.length === 0 ? (
					<span className="text-gray-500 text-sm">Tap letters below to build your answer</span>
				) : (
					selectedLetters.map((letter, index) => (
						<button
							key={`selected-${index}`}
							onClick={() => handleSelectedLetterClick(index)}
							disabled={disabled}
							className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{letter.toUpperCase()}
						</button>
					))
				)}
			</div>

			{/* Available letters */}
			<div className="w-full flex flex-wrap gap-2 justify-center">
				{availableLetters.map((letter, index) => (
					<button
						key={`available-${index}`}
						onClick={() => handleLetterClick(letter, index)}
						disabled={disabled}
						className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{letter.toUpperCase()}
					</button>
				))}
			</div>

			{/* Clear button */}
			{selectedLetters.length > 0 && (
				<button
					onClick={handleClear}
					disabled={disabled}
					className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Clear
				</button>
			)}
		</div>
	)
}
