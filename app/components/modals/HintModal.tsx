'use client'

interface HintModalProps {
	wordLength: number
	onClose: () => void
}

export const HintModal = ({ wordLength, onClose }: HintModalProps) => {
	return (
		<div className="hint-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center">The solution is a {wordLength}-letter word.</p>
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={onClose}
					className="flex-1 bg-primary hover:bg-secondary px-5 py-3 rounded-lg transition-colors"
				>
					Got it
				</button>
			</div>
		</div>
	)
}
