'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useBackDismiss } from '@/app/lib/useBackDismiss'

interface BottomSheetModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	icon?: string
	children: React.ReactNode
}

export const BottomSheetModal = ({ isOpen, onClose, title, icon, children }: BottomSheetModalProps) => {
	useBackDismiss(onClose, isOpen)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	if (typeof window === 'undefined') return null

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	if (!isOpen) return null

	return createPortal(
		<>
			{/* Overlay with fade transition */}
			<div
				className="fixed inset-0 bg-[#0c0905] z-[120] opacity-60 transition-opacity duration-[250ms] ease-linear"
				onClick={handleOverlayClick}
			/>

			{/* Bottom Sheet */}
			<div
				className="fixed inset-0 z-[120] flex flex-col justify-end mx-auto translate-y-0 opacity-100 transition-all duration-300 ease-out"
				onClick={handleOverlayClick}
			>
				<div
					className="stone-sheet w-full max-w-3xl mx-auto max-h-[90vh] flex flex-col relative z-10"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between gap-2 pb-2 sticky top-0 z-10">
						<h2 className="text-2xl text-gold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2">
							{icon && <img src={icon} alt="" className="w-6 h-6" />}
							{title || 'Modal'}
						</h2>
						<button
							onClick={onClose}
							className="shrink-0 cursor-pointer focus:outline-none transition-transform active:scale-90"
							aria-label="Close"
						>
							<img src="/gui/btn_close_green.png" alt="Close" className="w-10 h-10" />
						</button>
					</div>

					{/* Scrollable Content */}
					<div className="pt-2 pb-5 overflow-auto">{children}</div>
				</div>
			</div>
		</>,
		document.body
	)
}
