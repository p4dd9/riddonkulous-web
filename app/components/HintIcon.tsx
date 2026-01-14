'use client'

import { useState } from 'react'
import { BottomSheetModal } from './modals/BottomSheetModal'

interface HintIconProps {
	hint: string
	className?: string
}

export const HintIcon = ({ hint, className = '' }: HintIconProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<>
			<div className={`relative group ${className}`}>
				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="text-xs text-white/60 cursor-pointer border border-white/40 rounded-full w-4 h-4 flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
					aria-label="Show hint"
				>
					?
				</button>
				{/* Desktop tooltip - hidden on mobile */}
				<div className="absolute left-0 bottom-full mb-2 hidden md:group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 pointer-events-none">
					{hint}
				</div>
			</div>

			{/* Mobile modal */}
			<BottomSheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Hint">
				<div className="text-white text-sm">{hint}</div>
			</BottomSheetModal>
		</>
	)
}
