'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { useAuth } from '@/app/contexts/AuthContext'
import {
	deleteUserAccount,
	getCurrentUserData,
	updateUserData,
	validateUsername,
	type UserData,
} from '@/app/services/userService'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GeneralPage() {
	const { user, isLoading, refreshUser, signOut } = useAuth()
	const router = useRouter()
	const [userData, setUserData] = useState<UserData | null>(null)
	const [isLoadingUserData, setIsLoadingUserData] = useState(true)
	const [isEditingUsername, setIsEditingUsername] = useState(false)
	const [username, setUsername] = useState('')
	const [usernameError, setUsernameError] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
	const [showSettings, setShowSettings] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		if (!isLoading && user) {
			fetchUserData()
		} else if (!isLoading && !user) {
			setIsLoadingUserData(false)
		}
	}, [isLoading, user])

	const fetchUserData = async () => {
		setIsLoadingUserData(true)
		try {
			const data = await getCurrentUserData()
			if (data) {
				setUserData(data)
				setUsername(data.username || '')
			}
		} catch (error) {
			console.error('Error fetching user data:', error)
		} finally {
			setIsLoadingUserData(false)
		}
	}

	const handleUsernameChange = (value: string) => {
		setUsername(value)
		setUsernameError('')
		setSaveMessage(null)

		// Real-time validation
		const validationError = validateUsername(value)
		if (validationError) {
			setUsernameError(validationError)
		}
	}

	const handleSaveUsername = async () => {
		// Validate before submitting
		const validationError = validateUsername(username)
		if (validationError) {
			setUsernameError(validationError)
			return
		}

		// Check if username actually changed
		if (username === userData?.username) {
			setIsEditingUsername(false)
			return
		}

		setIsSaving(true)
		setUsernameError('')
		setSaveMessage(null)

		try {
			const response = await updateUserData({ username })
			if (response.status === 'success') {
				setUserData(response.data)
				setSaveMessage({ type: 'success', text: 'Username updated successfully!' })
				setIsEditingUsername(false)
				// Refresh auth context
				await refreshUser()
			}
		} catch (error: any) {
			if (error.status === 409) {
				setUsernameError('Username is already taken. Please choose another.')
			} else if (error.status === 400) {
				const errorMessage = error.details?.[0]?.message || 'Invalid username format'
				setUsernameError(errorMessage)
			} else {
				setSaveMessage({ type: 'error', text: error.message || 'Failed to update username' })
			}
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancelEdit = () => {
		setUsername(userData?.username || '')
		setUsernameError('')
		setSaveMessage(null)
		setIsEditingUsername(false)
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

	if (isLoading || isLoadingUserData) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user || !userData) {
		return null
	}

	return (
		<div className="w-full">
			<div className="bg-[var(--color-bg)] rounded-lg shadow-lg md:p-8">
				<h1 className="text-2xl md:text-3xl mb-6">Profile</h1>

				<div className="flex flex-col gap-4">
					{/* Email */}
					{/* <div className="bg-[var(--color-bg)] rounded-lg ">
						<label className="text-sm text-white/60 block mb-2">Email</label>
						<p className="text-lg text-white">{userData.email}</p>
					</div> */}

					{/* Username */}
					<div className="bg-[var(--color-bg)] rounded-lg ">
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm text-white/60 block">Username</label>
							{!isEditingUsername && (
								<BasicButton
									text="Edit"
									customClass="text-xs py-1 px-2"
									threeD={false}
									onClick={() => setIsEditingUsername(true)}
								/>
							)}
						</div>
						{isEditingUsername ? (
							<div className="space-y-3">
								<input
									type="text"
									value={username}
									onChange={(e) => handleUsernameChange(e.target.value)}
									className="w-full bg-[var(--color-bg)] border-2 border-primary rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
									placeholder="Enter username"
									disabled={isSaving}
								/>
								{usernameError && <p className="text-red-400 text-sm">{usernameError}</p>}
								{saveMessage && (
									<p
										className={`text-sm ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
									>
										{saveMessage.text}
									</p>
								)}
								<div className="flex gap-2">
									<BasicButton
										text={isSaving ? 'Saving...' : 'Save'}
										customClass="flex-1"
										threeD={false}
										onClick={handleSaveUsername}
										disabled={isSaving || !!usernameError || username === userData.username}
									/>
									<BasicButton
										text="Cancel"
										customClass="flex-1 bg-[var(--color-bg)] border-2 border-primary"
										threeD={false}
										onClick={handleCancelEdit}
										disabled={isSaving}
									/>
								</div>
							</div>
						) : (
							<p className="text-lg text-white">{userData.username || 'Not set'}</p>
						)}
					</div>

					{/* Role */}
					{/* <div className="bg-[var(--color-bg)] rounded-lg ">
						<label className="text-sm text-white/60 block mb-2">Role</label>
						<p className="text-lg text-white capitalize">{userData.role}</p>
					</div> */}

					{/* Account Created */}
					{userData.createdAt && (
						<div className="bg-[var(--color-bg)] rounded-lg ">
							<label className="text-sm text-white/60 block mb-2">Account Created</label>
							<p className="text-lg text-white">{new Date(userData.createdAt).toLocaleDateString()}</p>
						</div>
					)}

					{/* Advanced Settings Section */}
					<BasicButton
						onClick={() => setShowSettings(!showSettings)}
						customClass="w-full text-left justify-between"
						threeD={false}
					>
						<div className="flex items-center justify-between w-full">
							<span>Advanced Settings</span>
							<img src="/icons/gear.png" alt="" className="w-5 h-5" />
						</div>
					</BasicButton>

					{showSettings && (
						<div className="bg-[var(--color-bg)] rounded-lg p-6 border-2 border-red-500">
							<h3 className="text-xl mb-4 text-red-500">Danger Zone</h3>
							{showDeleteConfirm ? (
								<div className="bg-red-500/20 border border-red-700 rounded-lg p-4 space-y-4">
									<p className="text-red-300">
										Are you sure you want to delete your account? This action cannot be undone. All
										your data will be permanently deleted.
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
											customClass="flex-1 bg-[var(--color-bg)] border-2 border-primary"
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
									<p className="text-white/70 mb-4">
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
					)}
				</div>
			</div>
		</div>
	)
}
