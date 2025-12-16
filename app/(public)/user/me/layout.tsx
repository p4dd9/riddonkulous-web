'use client'

import { LoginButton } from '@/app/components/buttons/LoginButton'
import { useAuth } from '@/app/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface NavItem {
	href: string
	label: string
	icon: string
}

const navItems: NavItem[] = [
	{ href: '/user/me', label: 'General', icon: '/icons/character.png' },
	{ href: '/user/me/create', label: 'Create', icon: '/icons/pencil.png' },
	{ href: '/user/me/riddles', label: 'Riddles', icon: '/icons/script_lightning.png' },
	{ href: '/user/me/settings', label: 'Settings', icon: '/icons/gear.png' },
]

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth()
	const pathname = usePathname()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const sidebarRef = useRef<HTMLDivElement | null>(null)

	// Close sidebar on mobile when clicking outside or navigating
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
				const target = event.target as HTMLElement
				// Don't close if clicking the menu button
				if (!target.closest('button[aria-label*="menu" i]')) {
					setIsSidebarOpen(false)
				}
			}
		}

		if (isSidebarOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.body.style.overflow = ''
		}
	}, [isSidebarOpen])

	// Close sidebar on mobile when pathname changes
	useEffect(() => {
		setIsSidebarOpen(false)
	}, [pathname])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="w-full max-w-md">
					<div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
						<h1 className="text-3xl mb-6 text-center">User Dashboard</h1>
						<p className="text-gray-400 mb-6 text-center">You need to be logged in to access your dashboard.</p>
						<div className="flex justify-center">
							<LoginButton variant="drawer" className="w-full" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen w-full flex">
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				className="fixed top-20 left-4 z-[120] md:hidden flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 shadow-lg"
				aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
			>
				<Image src="/icons/folder.png" alt="Menu" width={24} height={24} className="w-6 h-6" />
			</button>

			{/* Sidebar */}
			<aside
				ref={sidebarRef}
				className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-800 border-r border-gray-700 z-[110] transform transition-transform duration-300 ease-out ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				}`}
			>
				<div className="flex flex-col h-full">
					{/* Sidebar Header */}
					<div className="p-4 border-b border-gray-700">
						<h2 className="text-xl font-semibold">Dashboard</h2>
					</div>

					{/* Navigation */}
					<nav className="flex-1 overflow-y-auto p-4">
						<ul className="flex flex-col gap-2">
							{navItems.map((item) => {
								// For /user/me, only match exactly. For other routes, match exactly.
								const isActive = pathname === item.href
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											onClick={() => setIsSidebarOpen(false)}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
												isActive
													? 'bg-primary text-white'
													: 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
											}`}
										>
											<Image src={item.icon} alt={item.label} width={20} height={20} className="w-5 h-5" />
											<span>{item.label}</span>
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>
				</div>
			</aside>

			{/* Overlay for mobile */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-[105] md:hidden"
					onClick={() => setIsSidebarOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Main Content */}
			<main className="flex-1 min-h-screen">
				<div className="w-full max-w-4xl mx-auto px-4 py-8 md:px-8">
					{/* Mobile spacing for menu button */}
					<div className="h-12 md:hidden" />
					{children}
				</div>
			</main>
		</div>
	)
}

