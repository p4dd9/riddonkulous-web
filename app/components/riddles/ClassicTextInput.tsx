'use client'

interface ClassicTextInputProps {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
	isIncorrect?: boolean
	placeholder?: string
}

export const ClassicTextInput = ({
	value,
	onChange,
	disabled = false,
	isIncorrect = false,
	placeholder = 'Type your answer here...',
}: ClassicTextInputProps) => {
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && value.trim()) {
			// Allow parent to handle submit
			e.preventDefault()
		}
	}

	return (
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyPress={handleKeyPress}
			disabled={disabled}
			className={`w-full px-4 py-3 rounded-md border-2 outline-none focus:outline-none focus:ring-0 text-lg ${
				isIncorrect
					? 'border-red-500'
					: 'border-gray-300 focus:border-primary'
			} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} bg-gray-800 text-white`}
			placeholder={placeholder}
		/>
	)
}
