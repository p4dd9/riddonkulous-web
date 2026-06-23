'use client'

import { useAnimatedGuessPlaceholder } from '@/app/lib/useAnimatedGuessPlaceholder'
import { useEffect, useState } from 'react'

interface ClassicTextInputProps {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
	feedback?: 'correct' | 'incorrect' | null
	isIncorrect?: boolean
	placeholder?: string
	id?: string
	className?: string
	animatePlaceholder?: boolean
	resetKey?: string
	onEnter?: () => void
	'aria-label'?: string
}

const getBorderClass = (feedback: 'correct' | 'incorrect' | null, isIncorrect: boolean) => {
	if (feedback === 'correct') return 'border-green-500'
	if (feedback === 'incorrect' || isIncorrect) return 'border-red-500'
	return 'border-primary'
}

export const ClassicTextInput = ({
	value,
	onChange,
	disabled = false,
	feedback = null,
	isIncorrect = false,
	placeholder = 'Type your answer here...',
	id = 'riddle-answer',
	className = '',
	animatePlaceholder = true,
	resetKey,
	onEnter,
	'aria-label': ariaLabel = 'Riddle answer',
}: ClassicTextInputProps) => {
	const [hasInteracted, setHasInteracted] = useState(false)

	useEffect(() => {
		setHasInteracted(false)
	}, [resetKey])

	const showAnimatedPlaceholder = animatePlaceholder && !hasInteracted && !value && !disabled
	const animatedPlaceholder = useAnimatedGuessPlaceholder(showAnimatedPlaceholder)

	const markInteracted = () => {
		setHasInteracted(true)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		markInteracted()
		onChange(e.target.value)
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		markInteracted()
		if (e.key === 'Enter' && value.trim() && onEnter) {
			e.preventDefault()
			onEnter()
		}
	}

	return (
		<div className={`relative w-full ${className}`}>
			<input
				id={id}
				type="text"
				value={value}
				onChange={handleChange}
				onKeyPress={handleKeyPress}
				onFocus={markInteracted}
				onPointerDown={markInteracted}
				disabled={disabled}
				className={`h-full w-full rounded-md border-2 bg-[var(--color-bg)] px-4 py-3 text-white outline-none focus:outline-none focus:ring-0 placeholder:text-white/40 ${getBorderClass(feedback, isIncorrect)} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
				placeholder={hasInteracted ? placeholder : ''}
				aria-label={ariaLabel}
			/>
			{showAnimatedPlaceholder && animatedPlaceholder && (
				<div
					className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40"
					aria-hidden="true"
				>
					<span>{animatedPlaceholder}</span>
					<span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white/40" />
				</div>
			)}
		</div>
	)
}
