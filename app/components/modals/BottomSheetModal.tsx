'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	icon?: string
	children: React.ReactNode
}

export const BottomSheetModal = ({ isOpen, onClose, title, icon, children }: BottomSheetModalProps) => {
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
				className="fixed inset-0 bg-black z-[120] opacity-50 transition-opacity duration-[250ms] ease-linear"
				onClick={handleOverlayClick}
			/>

			{/* Bottom Sheet */}
			<div
				className="fixed inset-0 z-[120] flex flex-col justify-end mx-auto translate-y-0 opacity-100 transition-all duration-300 ease-out"
				onClick={handleOverlayClick}
			>
				<div
					className="bg-[var(--color-bg)] w-full shadow-lg max-h-[90vh] flex flex-col rounded-t-2xl relative z-10"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between px-2 py-2 border-b-2 border-primary sticky top-0 z-10 bg-[var(--color-bg)]">
						<h2 className="text-xl whitespace-nowrap overflow-hidden text-ellipsis pl-2 flex items-center gap-2">
							{icon && <img src={icon} alt="" className="w-6 h-6" />}
							{title || 'Modal'}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-500 cursor-pointer hover:text-white text-4xl leading-none focus:outline-none px-2"
							aria-label="Close"
						>
							<img src="/icons/delete.png" alt="Close" className="w-7 h-7" />
						</button>
					</div>

					{/* Scrollable Content */}
					<div className="p-4 overflow-auto">{children}</div>
				</div>
			</div>
		</>,
		document.body
	)
}
