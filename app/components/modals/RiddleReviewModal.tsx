'use client'

interface RiddleReviewModalProps {
	onContinue: () => void
}

export const RiddleReviewModal = ({ onContinue }: RiddleReviewModalProps) => {
	return (
		<div className="riddle-review-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center mb-4">Your riddle has been sent for review.</p>
				<p className="text-gray-400 text-sm text-center">
					It will appear in your riddles once it&apos;s been approved by a moderator.
				</p>
			</div>

			<div className="flex gap-3 flex-col">
				<button
					onClick={onContinue}
					className="flex-1 btn-stone px-4 py-1"
				>
					Next
				</button>
			</div>
		</div>
	)
}
