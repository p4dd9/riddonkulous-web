'use client'

import { clearDismissal, isDesktopChromeOrEdge, isIOSDevice, isPWAInstalled, saveDismissal } from '@/app/lib/pwaUtils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BasicButton } from './BasicButton'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallButtonProps {
	initialIsIOS?: boolean
	initialIsDesktop?: boolean
}

export const PWAInstallButton = ({ initialIsIOS, initialIsDesktop }: PWAInstallButtonProps = {}) => {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [showIOSModal, setShowIOSModal] = useState(false)
	const [isIOS] = useState(() => initialIsIOS ?? isIOSDevice())
	const [isInstalled] = useState(isPWAInstalled)
	const [isDesktop] = useState(() => initialIsDesktop ?? isDesktopChromeOrEdge())

	useEffect(() => {
		if (isInstalled) return

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault()
			setDeferredPrompt(e as BeforeInstallPromptEvent)
		}

		const handleAppInstalled = () => {
			setDeferredPrompt(null)
			clearDismissal()
		}

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
		window.addEventListener('appinstalled', handleAppInstalled)

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
			window.removeEventListener('appinstalled', handleAppInstalled)
		}
	}, [isInstalled])

	const handleInstallClick = async () => {
		if (isIOS) {
			setShowIOSModal(true)
			return
		}

		if (deferredPrompt) {
			try {
				await deferredPrompt.prompt()
				const { outcome } = await deferredPrompt.userChoice

				if (outcome === 'accepted') {
					setDeferredPrompt(null)
					clearDismissal()
				} else {
					saveDismissal()
				}
			} catch (error) {
				console.error('Error showing install prompt:', error)
			}
		}
	}

	// Early return: Don't render anything if not compatible to avoid affecting grid layout
	// Only show if: installed (hide), OR (iOS/desktop compatible OR has deferredPrompt)
	const isCompatible = isIOS || isDesktop || deferredPrompt !== null
	if (isInstalled || !isCompatible) {
		return null
	}

	return (
		<>
			{/* Full-width Install Button with Enhanced Icon */}
			<div className="w-full">
				<button
					onClick={handleInstallClick}
					className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-3 md:px-8 md:py-5 flex items-center justify-between gap-3 md:gap-6 group relative overflow-hidden"
				>
					{/* Animated background gradient */}
					<div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

					{/* Download Icon with Animation */}
					<div className="relative z-10 flex items-center justify-center shrink-0">
						<div className="relative">
							{/* Glow effect */}
							<div className="absolute inset-0 bg-primary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
							{/* Icon container with bounce animation */}
							<div className="relative transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
								<Image
									src="/icons/package.png"
									alt="Download"
									width={48}
									height={48}
									className="rounded-xl shadow-lg drop-shadow-xl md:w-14 md:h-14"
								/>
							</div>
						</div>
					</div>

					{/* Text Content */}
					<div className="relative z-10 flex flex-col items-start flex-1 min-w-0">
						<span className="text-base md:text-xl group-hover:scale-105 transition-transform duration-300">
							Install Riddonkulous
						</span>
						<span className="text-xs md:text-sm opacity-90">
							{deferredPrompt
								? 'Get the full app experience'
								: isIOS
									? 'Add to your home screen'
									: 'Install for quick access'}
						</span>
					</div>
				</button>
			</div>

			{/* iOS Installation Modal */}
			{showIOSModal && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
					onClick={() => setShowIOSModal(false)}
				>
					<div
						className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold">Install Riddonkulous</h3>
							<button
								onClick={() => setShowIOSModal(false)}
								className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
								aria-label="Close"
							>
								×
							</button>
						</div>
						<div className="space-y-4">
							<p className="text-gray-700">To install Riddonkulous on your iOS device:</p>
							<ol className="list-decimal list-inside space-y-2 text-gray-700">
								<li>Tap the Share button at the bottom of your screen</li>
								<li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
								<li>Tap &quot;Add&quot; in the top right corner</li>
							</ol>
							<div className="flex justify-end pt-2">
								<BasicButton
									text="Got it"
									onClick={() => setShowIOSModal(false)}
									customClass="px-4 py-2"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
