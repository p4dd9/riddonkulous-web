'use client'

import { useEffect, useRef } from 'react'

/**
 * Bridge for the native Android hardware/gesture back button.
 *
 * The Capacitor shell (riddonkulous-mobile) dispatches a cancelable
 * `riddonkulous:backButton` event on the window before it navigates the
 * WebView history or exits the app. Any dismissible layer (modal, drawer,
 * bottom sheet) registers a dismiss callback here while it is open. On back,
 * the most-recently-opened layer is dismissed and the event is cancelled
 * (`preventDefault`), so the native side does nothing.
 *
 * Handlers are walked top-down and may *abstain* by returning `false`, in which
 * case the next-lower handler gets a turn; the first handler that returns `true`
 * cancels the event and stops the walk. If every handler abstains (or none is
 * registered) the event is left un-cancelled and native falls back to WebView
 * history navigation / minimise-exit.
 *
 * The route-back fallback (`registerBackFallback`, see `useRouteBackBridge`)
 * sits permanently at the bottom of the stack so that — when no overlay is
 * open — the site can own route-back itself instead of delegating to Android's
 * `WebView.canGoBack()`, which is unreliable for SPA `pushState` navigations.
 *
 * On the web (no native shell) the event never fires, so this is inert.
 */

type BackHandler = () => boolean

const stack: BackHandler[] = []
let listening = false

const onBackButton = (event: Event) => {
	// Walk top-down; the first handler that claims the press (returns true)
	// cancels the event. Handlers that abstain (false) yield to the next-lower
	// one — this is how the route-back fallback only runs when no overlay does.
	for (let i = stack.length - 1; i >= 0; i--) {
		if (stack[i]()) {
			event.preventDefault()
			return
		}
	}
	// Nothing claimed it — let native handle history/exit.
}

const ensureListening = () => {
	if (listening || typeof window === 'undefined') return
	window.addEventListener('riddonkulous:backButton', onBackButton)
	listening = true
}

const pushBackHandler = (fn: BackHandler): (() => void) => {
	ensureListening()
	stack.push(fn)
	return () => {
		const index = stack.lastIndexOf(fn)
		if (index !== -1) stack.splice(index, 1)
	}
}

/**
 * Register `onDismiss` as the handler for the native back button while the
 * layer is open. Mount-controlled modals (rendered only when open) can omit
 * `active`; `isOpen`-controlled layers should pass their open flag.
 *
 * An overlay always claims the back press, so the wrapped handler returns
 * `true` after dismissing.
 */
export const useBackDismiss = (onDismiss: () => void, active = true) => {
	const cb = useRef(onDismiss)

	// Keep the ref pointing at the latest callback without re-registering the
	// stack entry on every render (updating a ref must happen in an effect).
	useEffect(() => {
		cb.current = onDismiss
	})

	useEffect(() => {
		if (!active) return
		return pushBackHandler(() => {
			cb.current()
			return true
		})
	}, [active])
}

/**
 * Register a bottom-of-the-stack fallback for the native back button. Unlike
 * `useBackDismiss`, the handler may return `false` to abstain (e.g. when at the
 * navigation root, so native can minimise/exit). Used by `useRouteBackBridge`.
 *
 * Returns an unregister function. Register once, early (before any overlay can
 * open), so this stays underneath every overlay handler in the stack.
 */
export const registerBackFallback = (fn: BackHandler): (() => void) => pushBackHandler(fn)
