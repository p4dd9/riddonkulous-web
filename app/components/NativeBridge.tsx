'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRouteBackBridge } from '@/app/lib/useRouteBackBridge'

/**
 * Native (Capacitor) bridge — runs only inside the riddonkulous-mobile shell.
 *
 * The app loads this site as a remote WebView (`server.url`), so the native
 * shell's own `src/` bridge never executes in the page. This component is the
 * bridge: on a native platform it requests push permission, registers the FCM
 * token with reddicore, and deep-links riddle notifications. On the web it is
 * inert (`isNativePlatform()` is false), so it is safe to mount globally.
 *
 * Capacitor packages are loaded with dynamic `import()` inside the effect so
 * nothing touches the native bridge during SSR / in a plain browser bundle.
 */

const PUSH_REGISTER_URL = 'https://reddicore.hammertime.studio/api/v1/push/register'

export const NativeBridge = () => {
	const router = useRouter()

	// Own route-back for the native back button (see hook docs). Mounted here so
	// it registers once, at the layout root, underneath any overlay handler.
	useRouteBackBridge()

	useEffect(() => {
		let active = true

		const init = async () => {
			const { Capacitor } = await import('@capacitor/core')
			if (!Capacitor.isNativePlatform() || !active) return

			const { PushNotifications } = await import('@capacitor/push-notifications')

			const permission = await PushNotifications.requestPermissions()
			if (permission.receive !== 'granted' || !active) return

			// Clear listeners from a previous mount (HMR / remount) so we don't
			// double-register and POST the token twice.
			await PushNotifications.removeAllListeners()

			// Attach listeners BEFORE register() — the `registration` event can
			// fire as soon as a token is issued, before we'd otherwise be listening.
			await PushNotifications.addListener('registration', async (token) => {
				try {
					await fetch(PUSH_REGISTER_URL, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ token: token.value, platform: Capacitor.getPlatform() }),
					})
				} catch (err) {
					console.error('[Push] token registration failed', err)
				}
			})

			await PushNotifications.addListener('registrationError', (err) => {
				console.error('[Push] registration error', JSON.stringify(err))
			})

			await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
				// reddicore cronService sends data: { riddleNumber, postId } (strings).
				// riddleNumber → daily solver route; postId → individual riddle.
				const data = action.notification.data ?? {}
				if (data.riddleNumber) {
					router.push(`/riddle/daily/${data.riddleNumber}`)
				} else if (data.postId) {
					router.push(`/riddle/${data.postId}`)
				}
			})

			await PushNotifications.register()
		}

		void init()

		return () => {
			active = false
			void import('@capacitor/push-notifications')
				.then(({ PushNotifications }) => PushNotifications.removeAllListeners())
				.catch(() => {})
		}
	}, [router])

	return null
}
