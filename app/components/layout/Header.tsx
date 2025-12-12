'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BottomSheetModal } from '../modals/BottomSheetModal'
import { RedditConfirmModal } from '../modals/RedditConfirmModal'
import { Drawer } from './Drawer'

export const Header = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [isRedditModalOpen, setIsRedditModalOpen] = useState(false)

	const handleRedditConfirm = () => {
		window.open('https://www.reddit.com/r/riddonkulous', '_blank', 'noopener,noreferrer')
	}

	return (
		<>
			<header className="w-full flex items-center justify-between py-2 px-2 ">
				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsDrawerOpen((prev) => !prev)}
						className="flex items-center justify-center px-2 py-1 hover:bg-gray-800 rounded transition-colors cursor-pointer"
						aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
					>
						<Image src="/icons/folder.png" alt="Menu" width={28} height={28} className="w-7 h-7" />
					</button>
					<Link href="/" className="hover:opacity-80 transition-opacity">
						<h1>Riddonkulous</h1>
					</Link>
				</div>

				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => setIsRedditModalOpen(true)}
						className="text-sm py-1 flex items-center gap-2 bg-primary hover:bg-secondary px-2 rounded-md text-white transition-colors"
					>
						<Image src="/icons/pencil.png" alt="Create" width={16} height={16} className="w-4 h-4" />
						Create
					</button>
				</div>
			</header>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
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
