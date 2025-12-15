'use client'

import { LoginButton } from '@/app/components/buttons/LoginButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UserProfilePage() {
	const { user, isLoading, refreshUser } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading) {
			refreshUser()
		}
	}, [isLoading, refreshUser])

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
						<h1 className="text-3xl mb-6 text-center">User Profile</h1>
						<p className="text-gray-400 mb-6 text-center">You need to be logged in to view your profile.</p>
						<div className="flex justify-center">
							<LoginButton variant="drawer" className="w-full" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen w-full max-w-4xl mx-auto px-4 py-8">
			<div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
				<h1 className="text-3xl mb-6 text-center">User Profile</h1>

				<div className="flex flex-col items-center gap-6">
					{/* User Information */}
					<div className="w-full space-y-4">
						<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
							<label className="text-sm text-gray-400 block mb-1">Email</label>
							<p className="text-lg">{user.email}</p>
						</div>

						<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
							<label className="text-sm text-gray-400 block mb-1">User ID</label>
							<p className="text-lg font-mono text-sm break-all">{user.id}</p>
						</div>

						<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
							<label className="text-sm text-gray-400 block mb-1">Role</label>
							<p className="text-lg">
								<span
									className={`inline-block px-3 py-1 rounded-md ${
										user.role === 'admin'
											? 'bg-red-900/50 text-red-200 border border-red-700'
											: 'bg-primary/20 text-primary border border-primary/50'
									}`}
								>
									{user.role}
								</span>
							</p>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-4 mt-4">
						{user.role === 'admin' && (
							<button
								onClick={() => router.push('/admin')}
								className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-md transition-colors"
							>
								Go to Admin Panel
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
