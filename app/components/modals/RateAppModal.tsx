'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { openStoreListing } from '@/app/lib/requestAppReview'

interface RateAppModalProps {
	isOpen: boolean
	onClose: () => void
}

/**
 * Fallback prompt, shown only when the Play In-App Review card is unavailable
 * (see RateAppModalProvider). When the card is available it is shown on its
 * own — Play's guidance is not to put a prompt of our own in front of it.
 */
export const RateAppModal = ({ isOpen, onClose }: RateAppModalProps) => {
	const handleRate = () => {
		onClose()
		openStoreListing()
	}

	return (
		<BottomSheetModal isOpen={isOpen} onClose={onClose} title="Enjoying Riddonkulous?" icon="/icons/star.png">
			<div className="flex flex-col gap-4">
				<div className="text-center">
					<p className="text-lg mb-2">Rate us on Google Play</p>
					<p className="text-sm text-white/60">
						Nice solving! A quick rating helps other riddlers find the app.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<BasicButton
						text="Rate the App"
						customClass="w-full px-8 py-2"
						textAlign="center"
						threeD={true}
						onClick={handleRate}
					/>
					<BasicButton
						text="No Thanks"
						customClass="w-full"
						variant="secondary"
						threeD={false}
						onClick={onClose}
					/>
				</div>
			</div>
		</BottomSheetModal>
	)
}
