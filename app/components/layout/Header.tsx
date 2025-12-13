'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { BottomSheetModal } from '../modals/BottomSheetModal'
import { RedditConfirmModal } from '../modals/RedditConfirmModal'
import { Drawer } from './Drawer'

export const Header = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [isRedditModalOpen, setIsRedditModalOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const headerRef = useRef<HTMLElement>(null)
	const sentinelRef = useRef<HTMLDivElement>(null)
	const [headerHeight, setHeaderHeight] = useState<number | null>(null)

	// Measure header height on mount
	useEffect(() => {
		const header = headerRef.current
		if (!header) return

		const measureHeight = () => {
			setHeaderHeight(header.offsetHeight)
		}

		measureHeight()
		window.addEventListener('resize', measureHeight)

		return () => {
			window.removeEventListener('resize', measureHeight)
		}
	}, [])

	// Use sentinel element to detect when header scrolls out of view
	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return

		let rafId: number | null = null
		let lastState = false

		const observer = new IntersectionObserver(
			([entry]) => {
				// Throttle state updates using requestAnimationFrame to prevent flicker
				if (rafId) {
					cancelAnimationFrame(rafId)
				}

				rafId = requestAnimationFrame(() => {
					const newState = !entry.isIntersecting
					// Only update if state actually changed
					if (newState !== lastState) {
						lastState = newState
						setIsScrolled(newState)
					}
				})
			},
			{
				threshold: 0,
				rootMargin: '0px',
			}
		)

		observer.observe(sentinel)

		return () => {
			if (rafId) {
				cancelAnimationFrame(rafId)
			}
			observer.disconnect()
		}
	}, [])

	const handleRedditConfirm = () => {
		window.open('https://www.reddit.com/r/riddonkulous', '_blank', 'noopener,noreferrer')
	}

	return (
		<>
			<div className="relative">
				{/* Sentinel element to detect scroll position - positioned at top of header */}
				<div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px pointer-events-none" />
				<header
					ref={headerRef}
					className={`w-full flex items-center justify-between py-2 px-2 bg-[var(--color-bg)] ${
						isScrolled
							? 'fixed top-0 left-0 right-0 m-2 !w-[calc(100%-12px)] rounded z-[100] shadow-lg border-2 border-primary'
							: 'relative'
					}`}
				>
					<div className="flex items-center gap-1.5">
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
			</div>
			{/* Spacer to maintain layout when header becomes fixed - always rendered to prevent layout shift */}
			<div
				style={{
					height: isScrolled && headerHeight !== null ? `${headerHeight}px` : '0px',
				}}
				aria-hidden="true"
			/>
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
