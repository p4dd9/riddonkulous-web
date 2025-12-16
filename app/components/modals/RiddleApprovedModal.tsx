'use client'

import { ShareButton } from '@/app/components/ShareButton'
import Link from 'next/link'

interface RiddleApprovedModalProps {
	postId: string
	onContinue: () => void
}

export const RiddleApprovedModal = ({ postId, onContinue }: RiddleApprovedModalProps) => {
	const riddleUrl = `/riddle/${postId}`
	const fullRiddleUrl =
		typeof window !== 'undefined' ? `${window.location.origin}${riddleUrl}` : riddleUrl

	return (
		<div className="riddle-approved-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center mb-4">
					🎉 Your riddle has been approved and is now live!
				</p>
				<p className="text-gray-400 text-sm text-center">
					Would you like to view your riddle or continue creating?
				</p>
			</div>

			<div className="flex gap-3 flex-col">
				<ShareButton
					url={fullRiddleUrl}
					title="Share this riddle"
					buttonText="Share Riddle"
					className="w-full justify-center px-5 py-3"
				/>
				<Link
					href={riddleUrl}
					onClick={onContinue}
					className="flex-1 bg-primary hover:bg-secondary px-5 py-3 rounded-lg transition-colors text-center"
				>
					View Riddle
				</Link>
				<button
					onClick={onContinue}
					className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors"
				>
					Continue
				</button>
			</div>
		</div>
	)
}

