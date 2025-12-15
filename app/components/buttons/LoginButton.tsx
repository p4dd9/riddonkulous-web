'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { LoginModal } from '@/app/components/modals/LoginModal'
import { UserMenuModal } from '@/app/components/modals/UserMenuModal'
import { useAuth } from '@/app/contexts/AuthContext'
import { useCallback, useEffect, useState } from 'react'

interface LoginButtonProps {
	variant?: 'header' | 'drawer'
	className?: string
}

export const LoginButton = ({ variant = 'header', className = '' }: LoginButtonProps) => {
	const { user, signIn, isLoading } = useAuth()
	const [isInitialized, setIsInitialized] = useState(false)
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

	const handleCredentialResponse = useCallback(
		async (response: { credential: string }) => {
			try {
				await signIn(response.credential)
			} catch (error) {
				console.error('Login failed:', error)
				alert('Login failed. Please try again.')
			}
		},
		[signIn]
	)

	useEffect(() => {
		const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

		if (!clientId) {
			console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')
			return
		}

		const initGoogleSignIn = () => {
			if (window.google) {
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: handleCredentialResponse,
					use_fedcm_for_prompt: true, // Keep FedCM enabled for best UX when available
				})
				setIsInitialized(true)
			}
		}

		if (window.google) {
			initGoogleSignIn()
		} else {
			const checkGoogle = setInterval(() => {
				if (window.google) {
					initGoogleSignIn()
					clearInterval(checkGoogle)
				}
			}, 300)

			setTimeout(() => clearInterval(checkGoogle), 5000)
		}
	}, [handleCredentialResponse])

	const handleLoginClick = () => {
		if (!window.google || !isInitialized) {
			console.error('Google Identity Services not initialized')
			alert('Google sign-in is not available. Please refresh the page.')
			return
		}

		// Best practice: Try FedCM prompt() first (works seamlessly in normal mode)
		// Only open modal if the one-tap prompt explicitly doesn't display
		try {
			window.google.accounts.id.prompt?.((notification) => {
				// Only open modal if the prompt explicitly didn't display
				// If prompt displays (even if dismissed), don't show modal
				if (notification.isNotDisplayed) {
					// Prompt explicitly didn't display - show modal with Google Sign-In button
					setIsLoginModalOpen(true)
				}
				// If isSkippedMoment, isDismissedMoment, or user_cancel - prompt DID show, so don't open modal
				// If user successfully signs in, credential callback handles it and modal won't be needed
			})
		} catch (error) {
			// If prompt() throws an error (e.g., FedCM not available), show modal with button
			console.warn('Prompt failed, showing login modal:', error)
			setIsLoginModalOpen(true)
		}
	}

	const handleUserIconClick = () => {
		setIsUserMenuOpen(true)
	}

	// Match CreateButton's padding: py-1 px-2 for header variant
	const iconButtonCustomClass = variant === 'header' ? 'py-1 px-2' : 'p-2'

	if (isLoading) {
		return (
			<BasicButton
				icon="/icons/hourglass.png"
				iconClass="w-5 h-5"
				customClass={`${iconButtonCustomClass} opacity-50 ${className}`}
				threeD={false}
				disabled={true}
				onClick={() => {}}
			/>
		)
	}

	if (user) {
		return (
			<>
				<BasicButton
					icon="/icons/character.png"
					iconClass="w-5 h-5"
					customClass={`${iconButtonCustomClass} ${className}`}
					threeD={false}
					onClick={handleUserIconClick}
				/>
				<BottomSheetModal
					isOpen={isUserMenuOpen}
					onClose={() => setIsUserMenuOpen(false)}
					title="Menu"
					icon="/icons/character.png"
				>
					<UserMenuModal onClose={() => setIsUserMenuOpen(false)} />
				</BottomSheetModal>
			</>
		)
	}

	return (
		<>
			<BasicButton
				icon="/icons/character.png"
				iconClass="w-6 h-6"
				customClass={`${iconButtonCustomClass} ${className}`}
				threeD={false}
				onClick={handleLoginClick}
			/>
			<BottomSheetModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Sign In">
				<LoginModal onClose={() => setIsLoginModalOpen(false)} />
			</BottomSheetModal>
		</>
	)
}
