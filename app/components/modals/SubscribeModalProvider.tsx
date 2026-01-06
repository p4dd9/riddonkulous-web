'use client'

import { SubscribeModal, useShouldShowSubscribeModal } from '@/app/components/modals/SubscribeModal'
import { useEffect, useState } from 'react'

export const SubscribeModalProvider = () => {
	const shouldShow = useShouldShowSubscribeModal()
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (shouldShow) {
			// Small delay to ensure page is loaded
			const timer = setTimeout(() => {
				setIsOpen(true)
			}, 1000)
			return () => clearTimeout(timer)
		}
	}, [shouldShow])

	return <SubscribeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
