'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useCallback, useEffect, useRef } from 'react'

// Type declarations for Google Sign-In API
declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string
						callback: (response: { credential: string }) => void
						use_fedcm_for_prompt?: boolean
					}) => void
					prompt?: (
						momentNotification?: (notification: {
							isNotDisplayed: boolean
							isSkippedMoment: boolean
							isDismissedMoment: boolean
							reason: string
						}) => void
					) => void
					renderButton?: (
						element: HTMLElement,
						config: { theme?: string; size?: string; shape?: string; text?: string; width?: string }
					) => void
				}
			}
		}
	}
}

interface LoginModalProps {
	onClose: () => void
}

export const LoginModal = ({ onClose }: LoginModalProps) => {
	const { signIn } = useAuth()
	const buttonRef = useRef<HTMLDivElement>(null)

	const handleCredentialResponse = useCallback(
		async (response: { credential: string }) => {
			try {
				await signIn(response.credential)
				onClose() // Close modal on successful login
			} catch (error) {
				console.error('Login failed:', error)
				alert('Login failed. Please try again.')
			}
		},
		[signIn, onClose]
	)

	useEffect(() => {
		const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

		if (!clientId) {
			console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')
			return
		}

		if (!buttonRef.current || !window.google) {
			return
		}

		// Initialize Google Sign-In
		window.google.accounts.id.initialize({
			client_id: clientId,
			callback: handleCredentialResponse,
			// Don't use FedCM for button rendering - button works in incognito mode
			use_fedcm_for_prompt: false,
		})

		// Clear any existing button
		buttonRef.current.innerHTML = ''

		// Render Google Sign-In button
		window.google.accounts.id.renderButton?.(buttonRef.current, {
			theme: 'filled_black',
			shape: 'pill',
			size: 'large',
			text: 'signin_with',
			width: '100%',
		})
	}, [handleCredentialResponse])

	return (
		<div className="login-modal overflow-hidden">
			<div className="mb-6">
				<p className="text-gray-300 text-center">Sign in with your Google account to continue.</p>
			</div>

			<div className="flex gap-3 flex-col">
				{/* Google Sign-In Button Container */}
				<div ref={buttonRef} className="w-full flex justify-center" />
			</div>
		</div>
	)
}
