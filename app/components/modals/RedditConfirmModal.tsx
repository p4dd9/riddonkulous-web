'use client'

interface RedditConfirmModalProps {
	onConfirm: () => void
	onClose: () => void
}

export const RedditConfirmModal = ({ onConfirm, onClose }: RedditConfirmModalProps) => {
	const handleConfirm = () => {
		onConfirm()
		onClose()
	}

	return (
		<div className="reddit-confirm-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center">Do you want to continue to visit reddit.com/r/riddonkulous?</p>
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={onClose}
					className="flex-1 btn-stone-gray px-4 py-1"
				>
					Cancel
				</button>
				<button
					onClick={handleConfirm}
					className="flex-1 btn-stone px-4 py-1"
				>
					Yes, go to Reddit
				</button>
			</div>
		</div>
	)
}
