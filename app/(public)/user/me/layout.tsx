'use client'

import { LoginButton } from '@/app/components/buttons/LoginButton'
import { useAuth } from '@/app/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
	href: string
	label: string
	icon: string
}

const navItems: NavItem[] = [
	{ href: '/user/me', label: 'Profile', icon: '/icons/character.png' },
	{ href: '/user/me/create', label: 'Create', icon: '/icons/pencil.png' },
	{ href: '/user/me/riddles', label: 'Riddles', icon: '/icons/script_lightning.png' },
]

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth()
	const pathname = usePathname()

	if (isLoading) {
		return (
			<div className="flex items-center justify-center px-4">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center px-4 bg-[var(--color-bg)]">
				<div className="w-full max-w-md">
					<div className="bg-[var(--color-bg)] rounded-lg shadow-lg p-8">
						<h1 className="text-3xl mb-2 text-center">Welcome to Riddonkulous</h1>
						<p className="text-white/70 mb-8 text-center text-lg">
							Login or create an account to access your dashboard
						</p>
						<div className="flex justify-center">
							<LoginButton variant="drawer" className="w-full" />
						</div>
						<p className="text-white/50 text-sm text-center mt-6">
							Sign in with Google to get started. If you don&apos;t have an account, signing in will create one automatically.
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full flex flex-col bg-[var(--color-bg)]" data-user-dashboard>
			{/* Main Content */}
			<main className="flex-1 w-full pb-20 md:pb-24">
				<div className="w-full max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-8">
					{children}
				</div>
			</main>

			{/* Bottom Navigation Bar */}
			<nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[var(--color-bg)] border-t-2 border-primary pb-safe">
				<div className="max-w-4xl mx-auto">
					<ul className="flex items-center justify-around px-1 py-2 md:py-3">
						{navItems.map((item) => {
							const isActive = pathname === item.href
							return (
								<li key={item.href} className="flex-1">
									<Link
										href={item.href}
										className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg transition-all active:scale-95 ${
											isActive
												? 'text-primary'
												: 'text-white/60 active:text-white/80'
										}`}
									>
										<div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
											<Image
												src={item.icon}
												alt={item.label}
												width={24}
												height={24}
												className={`w-6 h-6 md:w-7 md:h-7 transition-opacity ${
													isActive ? 'opacity-100' : 'opacity-60'
												}`}
											/>
										</div>
										<span className={`text-xs md:text-sm transition-all ${isActive ? 'font-semibold' : 'font-normal'}`}>
											{item.label}
										</span>
									</Link>
								</li>
							)
						})}
					</ul>
				</div>
			</nav>
		</div>
	)
}

