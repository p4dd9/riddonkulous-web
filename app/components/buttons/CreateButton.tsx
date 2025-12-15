'use client'

import { BottomSheetModal } from '@/app/components/modals/BottomSheetModal'
import { RedditConfirmModal } from '@/app/components/modals/RedditConfirmModal'
import Image from 'next/image'
import { useState } from 'react'

interface CreateButtonProps {
	variant?: 'header' | 'drawer'
	className?: string
}

export const CreateButton = ({ variant = 'header', className = '' }: CreateButtonProps) => {
	const [isRedditModalOpen, setIsRedditModalOpen] = useState(false)

	const handleRedditConfirm = () => {
		window.open('https://www.reddit.com/r/riddonkulous', '_blank', 'noopener,noreferrer')
	}

	const baseClasses =
		variant === 'header'
			? 'text-sm cursor-pointer py-1 flex items-center gap-2 bg-primary hover:bg-secondary px-2 rounded-md text-white transition-colors'
			: 'w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-secondary rounded-md transition-colors text-white'

	return (
		<>
			<button onClick={() => setIsRedditModalOpen(true)} className={`${baseClasses} ${className}`}>
				<Image src="/icons/pencil.png" alt="Create" width={16} height={16} className="w-4 h-4" />
				Create
			</button>
			<BottomSheetModal
				isOpen={isRedditModalOpen}
				onClose={() => setIsRedditModalOpen(false)}
				title="Go to Reddit"
				icon="/icons/pencil.png"
			>
				<RedditConfirmModal onConfirm={handleRedditConfirm} onClose={() => setIsRedditModalOpen(false)} />
			</BottomSheetModal>
		</>
	)
}
