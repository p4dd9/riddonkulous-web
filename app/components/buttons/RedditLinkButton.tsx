'use client'

import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { RedditConfirmModal } from '@/app/components/modals/RedditConfirmModal'
import Image from 'next/image'
import { useState } from 'react'

interface RedditLinkButtonProps {
	href: string
	className?: string
}

export const RedditLinkButton = ({ href, className = '' }: RedditLinkButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleConfirm = () => {
		window.open(href, '_blank', 'noopener,noreferrer')
	}

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
				className={`flex items-center cursor-pointer justify-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm ${className}`}
				aria-label="Solve On Reddit"
			>
				<Image src="/icons/link.png" alt="Reddit" width={20} height={20} className="w-5 h-5" />
				<span className="hidden md:inline">Solve On Reddit</span>
			</button>

			<BottomSheetModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Go to Reddit"
				icon="/icons/link.png"
			>
				<RedditConfirmModal onConfirm={handleConfirm} onClose={() => setIsModalOpen(false)} />
			</BottomSheetModal>
		</>
	)
}

