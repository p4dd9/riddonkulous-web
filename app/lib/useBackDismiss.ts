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
 * (`preventDefault`), so the native side does nothing. When no layer is
 * registered the event is left un-cancelled and native falls back to WebView
 * history navigation / minimise-exit.
 *
 * On the web (no native shell) the event never fires, so this is inert.
 */

type DismissFn = () => void

const stack: DismissFn[] = []
let listening = false

const onBackButton = (event: Event) => {
	const top = stack[stack.length - 1]
	if (!top) return // nothing open — let native handle history/exit
	event.preventDefault()
	top()
}

const ensureListening = () => {
	if (listening || typeof window === 'undefined') return
	window.addEventListener('riddonkulous:backButton', onBackButton)
	listening = true
}

const pushBackHandler = (fn: DismissFn): (() => void) => {
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
 */
export const useBackDismiss = (onDismiss: DismissFn, active = true) => {
	const cb = useRef(onDismiss)

	// Keep the ref pointing at the latest callback without re-registering the
	// stack entry on every render (updating a ref must happen in an effect).
	useEffect(() => {
		cb.current = onDismiss
	})

	useEffect(() => {
		if (!active) return
		return pushBackHandler(() => cb.current())
	}, [active])
}
