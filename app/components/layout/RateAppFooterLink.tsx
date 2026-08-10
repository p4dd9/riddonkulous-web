'use client'

import { canRateApp, openStoreListing } from '@/app/lib/requestAppReview'
import { useEffect, useState } from 'react'

/**
 * "Rate App" footer entry, rendered only inside the Android app — on the web
 * there is nothing to rate (AppInstallBanner pitches the install instead), so
 * this renders null and the footer looks unchanged.
 *
 * Unlike the automatic prompt in RateAppModalProvider this is an explicit user
 * action, so it skips both RateAppModal and Play's In-App Review card and goes
 * straight to the store listing. Tapping "Rate App" already states the intent
 * the modal exists to ask for, and the card is unusable for a button press:
 * Play silently suppresses it when the user is over quota or the build wasn't
 * installed from Play, yet `requestReview()` resolves successfully either way,
 * so the tap would leave the UI untouched with nothing to fall back to. The
 * store listing always responds. It also leaves the once-per-user flag
 * untouched, so using this never suppresses the automatic prompt.
 *
 * Renders nothing on the server and on first paint — `canRateApp()` needs a
 * dynamic import of @capacitor/core — so there is no hydration mismatch.
 */
export const RateAppFooterLink = () => {
	const [canRate, setCanRate] = useState(false)

	useEffect(() => {
		let active = true
		void canRateApp().then((allowed) => {
			if (active) setCanRate(allowed)
		})
		return () => {
			active = false
		}
	}, [])

	if (!canRate) return null

	return (
		<>
			<span className="hidden md:inline">|</span>
			<button type="button" onClick={openStoreListing} className="hover:underline cursor-pointer">
				Rate App
			</button>
		</>
	)
}
