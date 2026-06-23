'use client'

import { isInNativeApp } from '@/app/lib/isInNativeApp'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.riddonkulous.app'

const DISMISS_KEY = 'riddonkulous:appBannerDismissedUntil'
// How long to keep the banner hidden after a dismissal.
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

const isDismissed = (): boolean => {
	try {
		const until = window.localStorage.getItem(DISMISS_KEY)
		return until !== null && Date.now() < Number(until)
	} catch {
		return false
	}
}

export const AppInstallBanner = () => {
	const [visible, setVisible] = useState(false)
	const [leaving, setLeaving] = useState(false)

	useEffect(() => {
		if (isDismissed()) return
		void isInNativeApp().then((inApp) => {
			if (!inApp) setVisible(true)
		})
	}, [])

	const dismiss = () => {
		try {
			window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DURATION_MS))
		} catch {
			// localStorage unavailable (private mode / blocked) — just hide for this session.
		}
		setLeaving(true)
		// Let the collapse animation play out before unmounting.
		window.setTimeout(() => setVisible(false), 250)
	}

	if (!visible) return null

	return (
		<div
			className={`grid overflow-hidden transition-all duration-200 ease-out ${
				leaving ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
			}`}
		>
			<div className="min-h-0">
				<div className="relative w-full border-b border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
					<div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 pr-12">
						<Image
							src="/web-app-manifest-192x192.png"
							alt=""
							width={44}
							height={44}
							className="h-11 w-11 shrink-0 rounded-xl shadow-lg ring-1 ring-white/10"
							aria-hidden
						/>
						<div className="min-w-0 flex-1">
							<p className="text-base leading-tight text-white">Riddonkulous for Android</p>
							<p className="text-sm leading-tight text-white/60">Daily riddles on the go</p>
						</div>
						<a
							href={PLAY_STORE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm text-bg shadow-md transition-colors hover:bg-secondary"
						>
							Install
						</a>
					</div>

					<button
						type="button"
						onClick={dismiss}
						aria-label="Dismiss"
						className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							aria-hidden
						>
							<path d="M6 6l12 12M18 6L6 18" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}
