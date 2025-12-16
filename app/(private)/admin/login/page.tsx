'use client'

import { LoginButton } from '@/app/components/buttons/LoginButton'
import { useAuth } from '@/app/contexts/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLoginPage() {
	const router = useRouter()
	const { user, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && user) {
			// Check if user is admin
			if (user.role === 'admin') {
				router.push('/admin')
			} else {
				// User is logged in but not admin
				alert('You do not have admin access. Please contact an administrator.')
			}
		}
	}, [user, isLoading, router])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center">Checking authentication...</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
					<div className="flex justify-center mb-6">
						<Image
							src="/pals/PAL056.gif"
							alt="Admin Login"
							width={200}
							height={200}
							className="w-32 h-32 md:w-48 md:h-48"
							unoptimized
						/>
					</div>
					<h1 className="text-3xl mb-6 text-center">Admin Login</h1>
					<div className="flex justify-center">
						<LoginButton variant="drawer" className="w-full" />
					</div>
				</div>
			</div>
		</div>
	)
}
