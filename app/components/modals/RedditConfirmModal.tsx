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
				<p className="text-gray-300 text-center">Do you want to continue to go to reddit.com?</p>
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={onClose}
					className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg  transition-colors"
				>
					Cancel
				</button>
				<button
					onClick={handleConfirm}
					className="flex-1 bg-primary hover:bg-secondary px-5 py-3 rounded-lg  transition-colors"
				>
					Yes, go to Reddit
				</button>
			</div>
		</div>
	)
}
