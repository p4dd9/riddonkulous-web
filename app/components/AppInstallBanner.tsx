'use client'

import { PLAY_STORE_URL } from '@/app/lib/appLinks'
import { isInNativeApp } from '@/app/lib/isInNativeApp'
import { isAndroidUserAgent } from '@/app/lib/userAgent'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const DISMISS_KEY = 'riddonkulous:appBannerDismissedUntil'
// How long to keep the banner hidden after a dismissal.
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

const isDismissed = (): boolean => {
	try {
		const until = window.localStorage.getItem(DISMISS_KEY)
		return until !== null && Date.now() < Number(until)
	} catch {
		return false
	}
}

export const AppInstallBanner = () => {
	const [mounted, setMounted] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (isDismissed()) return
		if (!isAndroidUserAgent(navigator.userAgent)) return
		let raf = 0
		void isInNativeApp().then((inApp) => {
			if (inApp) return
			setMounted(true)
			// Mount collapsed, then expand on the next frame so the transition runs.
			raf = window.requestAnimationFrame(() => {
				raf = window.requestAnimationFrame(() => setOpen(true))
			})
		})
		return () => window.cancelAnimationFrame(raf)
	}, [])

	const dismiss = () => {
		try {
			window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DURATION_MS))
		} catch {
			// localStorage unavailable (private mode / blocked) — just hide for this session.
		}
		setOpen(false)
		// Let the collapse animation play out before unmounting.
		window.setTimeout(() => setMounted(false), 300)
	}

	if (!mounted) return null

	return (
		<div
			className={`grid overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
				open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
			}`}
		>
			<div className="min-h-0">
				<div
					className={`relative w-full border-b border-primary/40 bg-bg transition-transform duration-300 ease-out motion-reduce:transition-none ${
						open ? 'translate-y-0' : '-translate-y-1'
					}`}
				>
					<div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:pr-12">
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
							<p className="flex items-center gap-2 text-sm leading-tight text-white/60">
								<span>Daily riddles on the go</span>
								<button
									type="button"
									onClick={dismiss}
									className="text-white/50 underline transition-colors hover:text-white/80 sm:hidden"
								>
									Dismiss
								</button>
							</p>
						</div>
						<a
							href={PLAY_STORE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm text-bg shadow-md transition-colors hover:bg-secondary"
						>
							<span className="sm:hidden">Install</span>
							<span className="hidden sm:inline">Install App</span>
						</a>
					</div>

					<button
						type="button"
						onClick={dismiss}
						aria-label="Dismiss"
						className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white sm:flex"
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
