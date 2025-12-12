'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { LinkAsButton } from '../buttons/LinkAsButton'
import { Drawer } from './Drawer'

export const Header = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
					<LinkAsButton
						href="https://www.reddit.com/r/riddonkulous"
						className="text-sm py-1 flex items-center gap-2"
						icon="/icons/pencil.png"
						target="_blank"
						rel="noopener noreferrer"
						iconClass="w-4 h-4"
					>
						Create
					</LinkAsButton>
				</div>
			</header>
			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
		</>
	)
}
