'use client'

import { RateAppModal } from '@/app/components/modals/RateAppModal'
import { canRateApp } from '@/app/lib/requestAppReview'
import { SOLVE_THRESHOLD, SOLVE_THRESHOLD_EVENT, getSolveCount } from '@/app/lib/solveCounter'
import { useCallback, useEffect, useState } from 'react'

/**
 * Asks for a Play Store rating once, after the visitor has locally solved
 * SOLVE_THRESHOLD riddles. Android app only — on the web this renders nothing
 * (AppInstallBanner handles the web-side pitch instead).
 *
 * Mounted at the layout root so it survives client-side navigation: the solve
 * that trips the threshold happens on a riddle page, but the prompt outlives
 * whatever route the user moves to next.
 */

const PROMPTED_KEY = 'riddonkulous:rateAppPrompted'

// Let the "correct!" feedback land (and the adventure transition start) before
// covering the screen with a modal.
const SHOW_DELAY_MS = 2000

const hasBeenPrompted = (): boolean => {
	try {
		return window.localStorage.getItem(PROMPTED_KEY) === 'true'
	} catch {
		// Can't read localStorage — assume prompted so we never nag repeatedly.
		return true
	}
}

const markPrompted = (): void => {
	try {
		window.localStorage.setItem(PROMPTED_KEY, 'true')
	} catch {
		// Nothing to do — worst case the prompt reappears in a later session.
	}
}

export const RateAppModalProvider = () => {
	const [isOpen, setIsOpen] = useState(false)

	// Marked as prompted on open, not on choice: declining is an answer, and
	// "once per user" means once regardless of what they picked.
	const open = useCallback(() => {
		markPrompted()
		setIsOpen(true)
	}, [])

	useEffect(() => {
		if (hasBeenPrompted()) return

		let active = true
		let timer = 0

		const schedule = () => {
			if (!active || timer) return
			timer = window.setTimeout(() => {
				if (active) open()
			}, SHOW_DELAY_MS)
		}

		void canRateApp().then((canRate) => {
			if (!canRate || !active) return

			// Already past the threshold on a previous visit (or the event fired
			// before this listener attached) — prompt on this page instead.
			if (getSolveCount() >= SOLVE_THRESHOLD) {
				schedule()
				return
			}

			window.addEventListener(SOLVE_THRESHOLD_EVENT, schedule)
		})

		return () => {
			active = false
			window.clearTimeout(timer)
			window.removeEventListener(SOLVE_THRESHOLD_EVENT, schedule)
		}
	}, [open])

	return <RateAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
