'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { registerBackFallback } from '@/app/lib/useBackDismiss'

/**
 * Makes the site own route-back for the native Android back button, instead of
 * delegating to the Capacitor shell's WebView-history fallback.
 *
 * The shell only calls `WebView.goBack()` / minimise-exit when no JS handler
 * cancels `riddonkulous:backButton`. But our in-app navigation uses Next's
 * `<Link>` / `router.push` (same-document `history.pushState`), and Android's
 * `WebView.canGoBack()` does not reliably register the *first* `pushState`
 * navigation after a fresh launch — so the shell thinks there's nowhere to go
 * back to and exits the app. (It "fixes itself" once a full navigation cycle
 * has primed the WebBackForwardList — hence the "works after visiting a single
 * view" symptom.)
 *
 * Instead we track in-app navigation depth ourselves and call `router.back()`,
 * which uses the JS History API (which *does* reflect `pushState`). This is
 * deterministic from the very first navigation. At the navigation root we
 * abstain, letting native minimise/exit as expected.
 *
 * Inert on the web: the event never fires, so the registered fallback is never
 * invoked.
 */

// Module-level: depth is a property of the WebView history session, not of any
// React subtree, and must survive remounts (HMR, route transitions).
let depth = 0
let backInFlight = false

export const useRouteBackBridge = () => {
	const router = useRouter()
	const pathname = usePathname()
	const isFirst = useRef(true)

	// Count forward navigations. The first run is the entry page (depth 0).
	// Each later pathname change is a push that deepens the stack — except the
	// change caused by our own router.back(), already accounted for when issued.
	// (A `router.replace()` is miscounted as a push; rare here, and the only
	// consequence is one extra back press before native exit.)
	useEffect(() => {
		if (isFirst.current) {
			isFirst.current = false
			return
		}
		if (backInFlight) {
			backInFlight = false
			return
		}
		depth += 1
	}, [pathname])

	// Bottom-of-stack fallback: runs only when no overlay claimed the back press.
	useEffect(() => {
		return registerBackFallback(() => {
			if (depth <= 0) return false // at the root — let native minimise/exit
			depth -= 1
			backInFlight = true
			router.back()
			return true
		})
	}, [router])
}
