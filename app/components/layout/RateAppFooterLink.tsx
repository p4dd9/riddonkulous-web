'use client'

import { canRateApp, openStoreListing, requestAppReview } from '@/app/lib/requestAppReview'
import { useEffect, useState } from 'react'

/**
 * "Rate App" footer entry, rendered only inside the Android app — on the web
 * there is nothing to rate (AppInstallBanner pitches the install instead), so
 * this renders null and the footer looks unchanged.
 *
 * Unlike the automatic prompt in RateAppModalProvider this is an explicit user
 * action, so it skips RateAppModal entirely: tapping "Rate App" already states
 * the intent the modal exists to ask for. It also leaves the once-per-user
 * flag untouched, so using this never suppresses the automatic prompt.
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

	const handleRate = async () => {
		// Fall back to the store listing when the Play card isn't available.
		if ((await requestAppReview()) === 'store') openStoreListing()
	}

	return (
		<>
			<span className="hidden md:inline">|</span>
			<button type="button" onClick={() => void handleRate()} className="hover:underline cursor-pointer">
				Rate App
			</button>
		</>
	)
}
