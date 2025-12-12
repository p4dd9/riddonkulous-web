'use client'

import type { Tag } from '@/app/services/tagService'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface DrawerProps {
	isOpen: boolean
	onClose: () => void
}

export const Drawer = ({ isOpen, onClose }: DrawerProps) => {
	const [tags, setTags] = useState<Tag[]>([])
	const [loading, setLoading] = useState(true)
	const drawerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isOpen) {
			const fetchTags = async () => {
				try {
					const response = await fetch('/api/tags')
					if (!response.ok) {
						throw new Error('Failed to fetch tags')
					}
					const data = await response.json()
					const sortedTags = data.tags.sort((a: Tag, b: Tag) => {
						const orderA = a.order ?? Number.MAX_SAFE_INTEGER
						const orderB = b.order ?? Number.MAX_SAFE_INTEGER
						if (orderA !== orderB) {
							return orderA - orderB
						}
						return a.label.localeCompare(b.label)
					})
					setTags(sortedTags)
				} catch (error) {
					console.error('Failed to fetch tags:', error)
				} finally {
					setLoading(false)
				}
			}
			fetchTags()
		}
	}, [isOpen])

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

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
				// Check if click is not on the folder button
				const target = event.target as HTMLElement
				if (!target.closest('button[aria-label*="menu" i]')) {
					onClose()
				}
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div
			ref={drawerRef}
			style={{ boxShadow: '0px 10px 8px 0px #0f0f0f' }}
			className={`fixed left-0 top-[57px] md:top-[57px] h-[calc(100vh-57px)] w-full md:w-80 bg-[var(--color-bg)] z-50 shadow-lg transform transition-transform duration-300 ease-out ${
				isOpen ? 'translate-x-0' : '-translate-x-full'
			}`}
		>
			<div className="flex flex-col h-full">
				{/* Content */}
				<div className="flex-1 overflow-y-auto p-4">
					{/* Featured */}
					<div className="flex flex-col gap-2 mb-4">
						<h3 className="text-lg  px-4 mb-2">Featured</h3>
						<Link
							href="/"
							onClick={onClose}
							className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
						>
							<Image
								src="/icons/light.png"
								alt="Riddle of the Day"
								width={24}
								height={24}
								className="w-6 h-6"
							/>
							<span className="text-lg">Riddle of the Day</span>
						</Link>
					</div>

					{/* Categories */}
					<div className="flex flex-col gap-2">
						<h3 className="text-lg  px-4 mb-2">Categories</h3>
						{loading ? (
							<div className="px-4 py-2 text-gray-400">Loading...</div>
						) : tags.length === 0 ? (
							<div className="px-4 py-2 text-gray-400">No categories found</div>
						) : (
							tags.map((tag) => (
								<Link
									key={tag.id}
									href={`/riddles/${tag.id}`}
									onClick={onClose}
									className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
								>
									<span className="text-base">{tag.label}</span>
									{tag.count !== undefined && (
										<span className="text-sm text-gray-400 ml-auto">({tag.count})</span>
									)}
								</Link>
							))
						)}
					</div>
				</div>

				{/* Bottom Button */}
				<div className="p-4 flex-shrink-0">
					<a
						href="https://www.reddit.com/r/riddonkulous"
						target="_blank"
						rel="noopener noreferrer"
						className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-secondary rounded-md transition-colors text-white "
					>
						Join On Reddit
					</a>
				</div>
			</div>
		</div>
	)
}
