declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string
						callback: (response: { credential: string }) => void
						use_fedcm_for_prompt?: boolean
						auto_select?: boolean
						cancel_on_tap_outside?: boolean
					}) => void
					prompt?: (
						momentNotification?: (notification: {
							isNotDisplayed: boolean
							isSkippedMoment: boolean
							isDismissedMoment: boolean
							reason: string
						}) => void
					) => void
					renderButton?: (
						element: HTMLElement,
						config: { theme?: string; size?: string; text?: string; width?: string; shape?: string }
					) => void
				}
			}
		}
	}
}

export {}



















