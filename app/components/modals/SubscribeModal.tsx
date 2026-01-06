'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { LoginModal } from '@/app/components/modals/LoginModal'
import { useAuth } from '@/app/contexts/AuthContext'
import { getCurrentUserData } from '@/app/services/userService'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const STORAGE_KEY = 'subscribe_modal_declined'
export const PAGE_LOAD_COUNT_KEY = 'subscribe_modal_page_load_count'
const DECLINE_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface SubscribeModalProps {
	isOpen: boolean
	onClose: () => void
}

export const SubscribeModal = ({ isOpen, onClose }: SubscribeModalProps) => {
	const { user, isLoading } = useAuth()
	const router = useRouter()
	const [userData, setUserData] = useState<{ emailSubscription?: boolean } | null>(null)
	const [showLoginModal, setShowLoginModal] = useState(false)
	const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)

	useEffect(() => {
		if (isOpen && user && !isLoading) {
			checkUserSubscription()
		}
	}, [isOpen, user, isLoading])

	const checkUserSubscription = async () => {
		if (!user) return

		setIsCheckingSubscription(true)
		try {
			const data = await getCurrentUserData()
			setUserData(data)
			// If user is subscribed, close modal
			if (data?.emailSubscription) {
				onClose()
			}
		} catch (error) {
			console.error('Error checking subscription:', error)
		} finally {
			setIsCheckingSubscription(false)
		}
	}

	const handleDecline = () => {
		const declinedUntil = Date.now() + DECLINE_DURATION_MS
		localStorage.setItem(STORAGE_KEY, declinedUntil.toString())
		onClose()
	}

	const handleSubscribe = () => {
		onClose()
		router.push('/subscribe')
	}

	const handleLoginSuccess = () => {
		setShowLoginModal(false)
		onClose()
		router.push('/subscribe')
	}

	return (
		<>
			<BottomSheetModal
				isOpen={isOpen && !showLoginModal}
				onClose={handleDecline}
				title="Stay Up to Date"
				icon="/icons/heart.png"
			>
				<div className="flex flex-col gap-4">
					<div className="text-center">
						<p className="text-lg mb-2">Get Weekly Riddles</p>
						<p className="text-sm text-white/60">
							Subscribe to our newsletter and receive the best riddles delivered to your inbox every week.
						</p>
					</div>

					{isCheckingSubscription ? (
						<div className="text-center py-4">
							<p className="text-white/60">Checking subscription status...</p>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{user ? (
								<LinkAsButton
									href="/subscribe"
									text="Subscribe"
									textAlign="center"
									customClass="w-full px-8 py-2"
								/>
							) : (
								<BasicButton
									text="Subscribe"
									customClass="w-full px-8 py-2"
									threeD={true}
									onClick={() => setShowLoginModal(true)}
								/>
							)}
							<BasicButton
								text="Maybe Later"
								customClass="w-full"
								variant="secondary"
								threeD={false}
								onClick={handleDecline}
							/>
						</div>
					)}
				</div>
			</BottomSheetModal>

			{showLoginModal && (
				<BottomSheetModal
					isOpen={showLoginModal}
					onClose={() => setShowLoginModal(false)}
					title="Login Required"
					icon="/icons/heart.png"
				>
					<LoginModal onClose={handleLoginSuccess} />
				</BottomSheetModal>
			)}
		</>
	)
}

/**
 * Hook to check if subscribe modal should be shown
 */
export const useShouldShowSubscribeModal = () => {
	const { user, isLoading } = useAuth()
	const [shouldShow, setShouldShow] = useState(false)

	useEffect(() => {
		const checkShouldShow = async () => {
			// Don't show if still loading
			if (isLoading) {
				setShouldShow(false)
				return
			}

			// Increment page load count
			const currentCount = parseInt(localStorage.getItem(PAGE_LOAD_COUNT_KEY) || '0', 10)
			const newCount = currentCount + 1
			localStorage.setItem(PAGE_LOAD_COUNT_KEY, newCount.toString())

			// Only show modal after the first page load (on second visit or later)
			if (newCount < 2) {
				setShouldShow(false)
				return
			}

			// Check localStorage for declined status
			const declinedUntil = localStorage.getItem(STORAGE_KEY)
			if (declinedUntil) {
				const declinedTimestamp = parseInt(declinedUntil, 10)
				if (Date.now() < declinedTimestamp) {
					// Still within decline period
					setShouldShow(false)
					return
				} else {
					// Decline period expired, remove from storage
					localStorage.removeItem(STORAGE_KEY)
				}
			}

			// If user is logged in, check subscription status
			if (user) {
				try {
					const data = await getCurrentUserData()
					// Don't show if user is subscribed
					if (data?.emailSubscription) {
						setShouldShow(false)
						return
					}
				} catch (error) {
					console.error('Error checking subscription:', error)
				}
			}

			// Show modal if we get here
			setShouldShow(true)
		}

		checkShouldShow()
	}, [user, isLoading])

	return shouldShow
}
