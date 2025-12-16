'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { deleteUserAccount } from '@/app/services/userService'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SettingsPage() {
	const { user, isLoading, signOut } = useAuth()
	const router = useRouter()
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	const handleDeleteAccount = async () => {
		if (!showDeleteConfirm) {
			setShowDeleteConfirm(true)
			return
		}

		setIsDeleting(true)

		try {
			await deleteUserAccount()
			// Sign out and redirect to home page
			await signOut()
			router.push('/')
		} catch (error: any) {
			alert(error.message || 'Failed to delete account. Please try again.')
			setIsDeleting(false)
			setShowDeleteConfirm(false)
		}
	}

	return (
		<div className="w-full">
			<div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 border border-gray-700">
				<h1 className="text-2xl md:text-3xl mb-6">Settings</h1>

				<div className="flex flex-col gap-6">
					{/* Delete Account Section */}
					<div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
						<h2 className="text-xl mb-4 text-red-400">Danger Zone</h2>
						{showDeleteConfirm ? (
							<div className="bg-red-900/20 border border-red-700 rounded-lg p-4 space-y-4">
								<p className="text-red-300">
									Are you sure you want to delete your account? This action cannot be undone. All your data will
									be permanently deleted.
								</p>
								<div className="flex flex-col sm:flex-row gap-3">
									<BasicButton
										text={isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
										customClass="flex-1 bg-red-600 hover:bg-red-700"
										threeD={false}
										onClick={handleDeleteAccount}
										disabled={isDeleting}
									/>
									<BasicButton
										text="Cancel"
										customClass="flex-1 bg-gray-600 hover:bg-gray-500"
										threeD={false}
										onClick={() => {
											setShowDeleteConfirm(false)
											setIsDeleting(false)
										}}
										disabled={isDeleting}
									/>
								</div>
							</div>
						) : (
							<div>
								<p className="text-gray-300 mb-4">
									Once you delete your account, there is no going back. Please be certain.
								</p>
								<BasicButton
									text="Delete Account"
									customClass="bg-red-600 hover:bg-red-700"
									threeD={false}
									onClick={handleDeleteAccount}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}


