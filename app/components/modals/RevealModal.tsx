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
					className="flex-1 btn-stone-gray px-4 py-1"
				>
					Yes, reveal answer
				</button>
				<button
					onClick={onClose}
					className="flex-1 btn-stone px-4 py-1"
				>
					No, keep trying
				</button>
			</div>
		</div>
	)
}
