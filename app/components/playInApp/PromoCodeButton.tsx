'use client'

import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { useState } from 'react'

interface PromoCode {
	code: string
	url: string
}

/**
 * Landing page link that opens the promo code sheet: the visitor types the
 * giveaway word, the server hands out one Google Play code (one per visitor,
 * see app/lib/promoCodes.ts) and the sheet links to Play's redeem page.
 */
export const PromoCodeButton = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [word, setWord] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [promo, setPromo] = useState<PromoCode | null>(null)
	const [copied, setCopied] = useState(false)

	const close = () => {
		setIsOpen(false)
		setError('')
	}

	const submit = async (event: React.FormEvent) => {
		event.preventDefault()
		if (isLoading || !word.trim()) return
		setIsLoading(true)
		setError('')
		try {
			const response = await fetch('/api/promo-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ word }),
			})
			const data = await response.json()
			if (response.ok && data.code) {
				setPromo({ code: data.code, url: data.url })
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

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="text-sm md:text-lg opacity-80 underline hover:text-primary transition-colors cursor-pointer"
			>
				Have the secret word? Get an Android promo code
			</button>

			<BottomSheetModal isOpen={isOpen} onClose={close} title="Android promo code">
				<div className="max-w-md mx-auto flex flex-col gap-4 text-center">
					{promo ? (
						<>
							<p className="text-gray-300">Here is your Google Play code. It works once, so keep it to yourself.</p>
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
								Redeem on Google Play
							</a>
							<p className="text-sm opacity-70">
								Open the link with the Google account you use on your Android phone, then start Riddonkulous.
							</p>
						</>
					) : (
						<form onSubmit={submit} className="flex flex-col gap-4">
							<p className="text-gray-300">
								Type the secret word to get a Google Play promo code for the Android app. One code per person.
							</p>
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
									disabled={isLoading || !word.trim()}
									className="flex-1 bg-primary hover:bg-secondary text-bg px-5 py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
								>
									{isLoading ? 'Checking…' : 'Get my code'}
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
