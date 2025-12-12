'use client'

interface RevealModalProps {
	onConfirm: () => void
	onClose: () => void
}

export const RevealModal = ({ onConfirm, onClose }: RevealModalProps) => {
	const handleConfirm = () => {
		onConfirm()
		onClose()
	}

	return (
		<div className="give-up-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center">Are you sure you want to reveal the answer?</p>
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={handleConfirm}
					className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg  transition-colors"
				>
					Yes, reveal answer
				</button>
				<button
					onClick={onClose}
					className="flex-1 bg-primary hover:bg-secondary px-5 py-3 rounded-lg  transition-colors"
				>
					No, keep trying
				</button>
			</div>
		</div>
	)
}
