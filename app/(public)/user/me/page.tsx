'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { HintIcon } from '@/app/components/HintIcon'
import { useAuth } from '@/app/contexts/AuthContext'
import {
	deleteUserAccount,
	getCurrentUserData,
	subscribeToNewsletter,
	unsubscribeFromNewsletter,
	updateUserData,
	validateUsername,
	type UserData,
} from '@/app/services/userService'
import Image from 'next/image'
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
	const [isEditingAvatar, setIsEditingAvatar] = useState(false)
	const [selectedAvatar, setSelectedAvatar] = useState('')

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
				setSelectedAvatar(data.avatar || 'avatar_02.png')
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

	const handleSaveAvatar = async (avatar: string) => {
		setIsSaving(true)
		setSaveMessage(null)

		try {
			const response = await updateUserData({ avatar })
			if (response.status === 'success') {
				setUserData(response.data)
				setSelectedAvatar(response.data.avatar || 'avatar_02.png')
				setSaveMessage({ type: 'success', text: 'Avatar updated successfully!' })
				setIsEditingAvatar(false)
				// Refresh auth context
				await refreshUser()
				setTimeout(() => setSaveMessage(null), 3000)
			}
		} catch (error: any) {
			setSaveMessage({ type: 'error', text: error.message || 'Failed to update avatar' })
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancelAvatarEdit = () => {
		setSelectedAvatar(userData?.avatar || 'avatar_02.png')
		setIsEditingAvatar(false)
		setSaveMessage(null)
	}

	const handleToggleSubscription = async () => {
		if (!userData) return

		// Optimistically update UI
		const isSubscribed = userData.emailSubscription || false
		setUserData({ ...userData, emailSubscription: !isSubscribed })

		try {
			const response = isSubscribed ? await unsubscribeFromNewsletter() : await subscribeToNewsletter()
			if (response.status === 'success') {
				// Merge response data with existing userData to preserve all fields
				setUserData({ ...userData, ...response.data })
			}
		} catch (error) {
			// Revert on error
			setUserData({ ...userData, emailSubscription: isSubscribed })
			console.error('Failed to update subscription:', error)
		}
	}

	// Generate array of all 40 avatars
	const avatarOptions = Array.from({ length: 40 }, (_, i) => {
		const num = (i + 1).toString().padStart(2, '0')
		return `avatar_${num}.png`
	})

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
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
					<h1 className="text-2xl md:text-3xl">Profile</h1>
					{userData.username && (
						<BasicButton
							text="Share Profile"
							icon="/icons/world.png"
							customClass="text-sm py-2 px-4 whitespace-nowrap"
							threeD={false}
							onClick={() => {
								const profileUrl = `${window.location.origin}/profile/${userData.username}`
								if (navigator.share) {
									navigator.share({
										title: `${userData.username}'s Profile`,
										url: profileUrl,
									})
								} else {
									navigator.clipboard.writeText(profileUrl)
									setSaveMessage({ type: 'success', text: 'Profile link copied to clipboard!' })
									setTimeout(() => setSaveMessage(null), 3000)
								}
							}}
						/>
					)}
				</div>

				{/* Intro Text */}
				<div className="mb-6">
					<p className="text-sm text-white/70 leading-relaxed">
						Your public data is displayed in your public profile. Users with a username inspire more trust
						among other users.{' '}
						{userData.username && (
							<>
								Here&apos;s{' '}
								<button
									type="button"
									onClick={() => router.push(`/profile/${userData.username}`)}
									className="text-primary hover:text-secondary underline transition-colors"
								>
									your public profile
								</button>
								.
							</>
						)}
					</p>
				</div>

				<div className="flex flex-col gap-4">
					{/* Avatar */}
					<div className="bg-[var(--color-bg)] rounded-lg">
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm text-white/60 block">Avatar</label>
							{!isEditingAvatar && (
								<BasicButton
									text="Edit"
									customClass="text-xs py-1 px-2"
									threeD={false}
									onClick={() => setIsEditingAvatar(true)}
								/>
							)}
						</div>
						{isEditingAvatar ? (
							<div className="space-y-3">
								<div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[400px] overflow-y-auto p-2 bg-[var(--color-bg)] rounded-lg">
									{avatarOptions.map((avatar) => (
										<button
											key={avatar}
											onClick={() => setSelectedAvatar(avatar)}
											className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
												selectedAvatar === avatar
													? 'border-primary scale-110'
													: 'border-transparent hover:border-white/30'
											}`}
											disabled={isSaving}
										>
											<Image
												src={`/avatars/${avatar}`}
												alt={avatar}
												fill
												className="object-cover"
											/>
										</button>
									))}
								</div>
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
										onClick={() => handleSaveAvatar(selectedAvatar)}
										disabled={isSaving || selectedAvatar === userData.avatar}
									/>
									<BasicButton
										text="Cancel"
										customClass="flex-1 bg-[var(--color-bg)] border-2 border-primary"
										threeD={false}
										onClick={handleCancelAvatarEdit}
										disabled={isSaving}
									/>
								</div>
							</div>
						) : (
							<div className="flex items-center gap-4">
								<div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary">
									<Image
										src={`/avatars/${userData.avatar || 'avatar_02.png'}`}
										alt="Your avatar"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						)}
					</div>

					{/* Email */}
					{/* <div className="bg-[var(--color-bg)] rounded-lg ">
						<label className="text-sm text-white/60 block mb-2">Email</label>
						<p className="text-lg text-white">{userData.email}</p>
					</div> */}

					{/* Username */}
					<div className="bg-[var(--color-bg)] rounded-lg ">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<label className="text-sm text-white/60 block">Username</label>
								<HintIcon hint="Username can only be changed once every 180 days" />
							</div>
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
							<div className="flex items-center gap-2 mb-2">
								<label className="text-sm text-white/60 block">Riddle Day</label>
								<HintIcon hint="Day you created your Riddonkulous account" />
							</div>
							<p className="text-lg text-white">{new Date(userData.createdAt).toLocaleDateString()}</p>
						</div>
					)}

					{/* Email */}
					<div className="bg-[var(--color-bg)] rounded-lg">
						<label className="text-sm text-white/60 block mb-2">Email</label>
						<p className="text-lg text-white">{userData.email}</p>
					</div>

					{/* Email Newsletter Subscription */}
					<div className="bg-[var(--color-bg)] rounded-lg">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
							<div className="flex flex-col flex-1">
								<label className="text-sm text-white/60 block mb-1 flex items-center gap-2">
									<img src="/icons/script.png" alt="" className="w-4 h-4" />
									Weekly Newsletter
								</label>
								<p className="text-xs text-white/40">
									{userData.emailSubscription
										? 'You are subscribed to our weekly newsletter. The newsletter uses the email you registered with Google.'
										: 'Subscribe to receive our weekly newsletter. The newsletter uses the email you registered with Google.'}
								</p>
							</div>
							<button
								type="button"
								onClick={handleToggleSubscription}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] cursor-pointer flex-shrink-0 ${
									userData.emailSubscription ? 'bg-primary' : 'bg-gray-600'
								}`}
								aria-label={
									userData.emailSubscription
										? 'Unsubscribe from newsletter'
										: 'Subscribe to newsletter'
								}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										userData.emailSubscription ? 'translate-x-6' : 'translate-x-1'
									}`}
								/>
							</button>
						</div>
					</div>

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
							<h3 className="text-xl mb-4 text-red-500 flex items-center gap-2">
								<img src="/icons/skull.png" alt="" className="w-6 h-6" />
								Danger Zone
							</h3>
							{showDeleteConfirm ? (
								<div className="bg-red-500/20 border border-red-700 rounded-lg p-4 space-y-4">
									<p className="text-red-300">
										Are you sure you want to delete your account? This action cannot be undone. All
										your data will be permanently deleted.
									</p>
									<div className="flex flex-col sm:flex-row gap-3">
										<BasicButton
											text={isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
											icon="/icons/skull.png"
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
