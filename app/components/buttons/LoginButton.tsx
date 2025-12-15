'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useCallback, useEffect, useState } from 'react'

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string
						callback: (response: { credential: string }) => void
						use_fedcm_for_prompt?: boolean
						auto_select?: boolean
						cancel_on_tap_outside?: boolean
					}) => void
					prompt: (
						momentNotification?: (notification: {
							isNotDisplayed: boolean
							isSkippedMoment: boolean
							isDismissedMoment: boolean
							reason: string
						}) => void
					) => void
					renderButton: (
						element: HTMLElement,
						config: { theme?: string; size?: string; text?: string; width?: string; shape?: string }
					) => void
				}
			}
		}
	}
}

interface LoginButtonProps {
	variant?: 'header' | 'drawer'
	className?: string
}

export const LoginButton = ({ variant = 'header', className = '' }: LoginButtonProps) => {
	const { user, signIn, signOut, isLoading } = useAuth()
	const [isInitialized, setIsInitialized] = useState(false)

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
		if (window.google && isInitialized) {
			window.google.accounts.id.prompt()
		} else {
			console.error('Google Identity Services not initialized')
			alert('Google sign-in is not available. Please refresh the page.')
		}
	}

	const handleLogoutClick = async () => {
		try {
			await signOut()
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	const baseClasses =
		variant === 'header'
			? 'text-sm cursor-pointer py-1 flex items-center gap-2 bg-primary hover:bg-secondary px-2 rounded-md text-white transition-colors'
			: 'w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-secondary rounded-md transition-colors text-white'

	if (isLoading) {
		return (
			<button disabled className={`${baseClasses} ${className} opacity-50 cursor-not-allowed`}>
				Loading...
			</button>
		)
	}

	if (user) {
		return (
			<button onClick={handleLogoutClick} className={`${baseClasses} ${className}`}>
				Logout
			</button>
		)
	}

	return (
		<button onClick={handleLoginClick} className={`${baseClasses} ${className}`}>
			Login
		</button>
	)
}
