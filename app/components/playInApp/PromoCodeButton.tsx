'use client'

import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { useState } from 'react'

type Platform = 'android' | 'ios'

interface PromoCode {
	platform: Platform
	code: string
	url: string
}

const PLATFORMS: Record<Platform, { label: string; store: string; codeName: string; account: string }> = {
	ios: {
		label: 'iOS',
		store: 'the App Store',
		codeName: 'App Store code',
		account: 'Open the link on your iPhone or iPad, signed in with your Apple Account, then start Riddonkulous.',
	},
	android: {
		label: 'Android',
		store: 'Google Play',
		codeName: 'Google Play code',
		account: 'Open the link with the Google account you use on your Android phone, then start Riddonkulous.',
	},
}

const PLATFORM_ORDER: Platform[] = ['ios', 'android']

const detectPlatform = (): Platform => (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) ? 'ios' : 'android')

/**
 * Landing page link that opens the promo code sheet: the visitor picks iOS or
 * Android and types the giveaway word, the server hands out one store code
 * (one per visitor and platform, see app/lib/promoCodes.ts) and the sheet
 * links to the store's redeem page.
 */
export const PromoCodeButton = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [platform, setPlatform] = useState<Platform | null>(null)
	const [word, setWord] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [promo, setPromo] = useState<PromoCode | null>(null)
	const [copied, setCopied] = useState(false)

	const open = () => {
		// Preselect the visitor's own platform the first time the sheet opens.
		if (!platform) setPlatform(detectPlatform())
		setIsOpen(true)
	}

	const close = () => {
		setIsOpen(false)
		setError('')
	}

	const choosePlatform = (next: Platform) => {
		setPlatform(next)
		setError('')
	}

	const submit = async (event: React.FormEvent) => {
		event.preventDefault()
		if (isLoading || !platform || !word.trim()) return
		setIsLoading(true)
		setError('')
		try {
			const response = await fetch('/api/promo-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ word, platform }),
			})
			const data = await response.json()
			if (response.ok && data.code) {
				setPromo({ platform, code: data.code, url: data.url })
			} else {
				setError(data.error || 'Something went wrong. Try again later.')
			}
		} catch {
			setError('Something went wrong. Try again later.')
		} finally {
			setIsLoading(false)
		}
	}

	const copy = async () => {
		if (!promo) return
		try {
			await navigator.clipboard.writeText(promo.code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			// The code stays on screen to copy by hand.
		}
	}

	const otherPlatform: Platform | null = promo ? (promo.platform === 'ios' ? 'android' : 'ios') : null

	const getOtherCode = () => {
		if (!otherPlatform) return
		setPromo(null)
		setCopied(false)
		setPlatform(otherPlatform)
	}

	return (
		<>
			<button
				type="button"
				onClick={open}
				className="text-sm md:text-lg opacity-80 underline hover:text-primary transition-colors cursor-pointer"
			>
				Have the secret word? Get an iOS or Android promo code
			</button>

			<BottomSheetModal isOpen={isOpen} onClose={close} title="Promo code">
				<div className="max-w-md mx-auto flex flex-col gap-4 text-center">
					{promo ? (
						<>
							<p className="text-gray-300">
								Here is your {PLATFORMS[promo.platform].codeName}. It works once, so keep it to
								yourself.
							</p>
							<button
								type="button"
								onClick={copy}
								className="bg-black/30 border-2 border-primary rounded-lg px-4 py-3 text-xl md:text-2xl tracking-widest break-all cursor-pointer"
								aria-label="Copy the code"
							>
								{promo.code}
							</button>
							<p className="text-sm opacity-70">{copied ? 'Copied!' : 'Tap the code to copy it.'}</p>
							<a
								href={promo.url}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-primary hover:bg-secondary text-bg px-5 py-3 rounded-lg transition-colors"
							>
								Redeem on {PLATFORMS[promo.platform].store}
							</a>
							<p className="text-sm opacity-70">{PLATFORMS[promo.platform].account}</p>
							{otherPlatform && (
								<button
									type="button"
									onClick={getOtherCode}
									className="text-sm opacity-70 underline hover:text-primary transition-colors cursor-pointer"
								>
									Need an {PLATFORMS[otherPlatform].label} code instead?
								</button>
							)}
						</>
					) : (
						<form onSubmit={submit} className="flex flex-col gap-4">
							<p className="text-gray-300">
								Pick your phone and type the secret word to get a promo code for the app. One code per
								person.
							</p>
							<div className="flex gap-3" role="radiogroup" aria-label="Platform">
								{PLATFORM_ORDER.map((option) => (
									<button
										key={option}
										type="button"
										role="radio"
										aria-checked={platform === option}
										onClick={() => choosePlatform(option)}
										className={`flex-1 border-2 border-primary rounded-lg px-4 py-2 text-xl transition-colors cursor-pointer ${
											platform === option ? 'bg-primary text-bg' : 'bg-black/30 hover:bg-black/50'
										}`}
									>
										{PLATFORMS[option].label}
									</button>
								))}
							</div>
							<input
								type="text"
								value={word}
								onChange={(event) => setWord(event.target.value.toUpperCase())}
								placeholder="SECRET WORD"
								aria-label="Secret word"
								autoComplete="off"
								autoCapitalize="characters"
								spellCheck={false}
								maxLength={32}
								className="bg-black/30 border-2 border-primary rounded-lg px-4 py-3 text-center text-2xl tracking-widest uppercase focus:outline-none"
							/>
							{error && (
								<p className="text-[var(--color-primary)]" role="alert">
									{error}
								</p>
							)}
							<div className="flex gap-3 flex-col">
								<button
									type="submit"
									disabled={isLoading || !platform || !word.trim()}
									className="flex-1 bg-primary hover:bg-secondary text-bg px-5 py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
								>
									{isLoading
										? 'Checking…'
										: `Get my ${platform ? PLATFORMS[platform].label : ''} code`}
								</button>
								<button
									type="button"
									onClick={close}
									className="flex-1 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors cursor-pointer"
								>
									Cancel
								</button>
							</div>
						</form>
					)}
				</div>
			</BottomSheetModal>
		</>
	)
}
