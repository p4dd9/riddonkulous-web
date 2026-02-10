'use client'

import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { ShareModal } from '@/app/components/modals/ShareModal'
import Image from 'next/image'
import { useState } from 'react'

interface ShareButtonProps {
	url?: string
	title?: string
	className?: string
	iconOnly?: boolean
	buttonText?: string
	modalTitle?: string
	modalDescription?: string
	icon?: string
	iconAlt?: string
}

export const ShareButton = ({
	url,
	title,
	className = '',
	iconOnly = false,
	buttonText = 'Share',
	modalTitle = 'Share',
	modalDescription,
	icon = '/icons/world.png',
	iconAlt = 'Share',
}: ShareButtonProps) => {
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)

	return (
		<>
			<button
				onClick={() => setIsShareModalOpen(true)}
				className={`flex items-center cursor-pointer justify-center gap-2 px-3 py-1.5 bg-primary hover:bg-secondary rounded-md transition-colors ${className}`}
				aria-label={iconAlt}
			>
				<Image src={icon} alt={iconAlt} width={20} height={20} className="w-5 h-5" />
				{!iconOnly && <span className="text-sm">{buttonText}</span>}
			</button>

			<BottomSheetModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				title={modalTitle}
				icon={icon}
			>
				<ShareModal url={url} title={title} description={modalDescription} onClose={() => setIsShareModalOpen(false)} />
			</BottomSheetModal>
		</>
	)
}
