'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { getCurrentUserData, updateUserData, validateUsername, type UserData } from '@/app/services/userService'
import { useEffect, useState } from 'react'

export default function GeneralPage() {
	const { user, isLoading, refreshUser } = useAuth()
	const [userData, setUserData] = useState<UserData | null>(null)
	const [isLoadingUserData, setIsLoadingUserData] = useState(true)
	const [isEditingUsername, setIsEditingUsername] = useState(false)
	const [username, setUsername] = useState('')
	const [usernameError, setUsernameError] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
			<div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 border border-gray-700">
				<h1 className="text-2xl md:text-3xl mb-6">General</h1>

				<div className="flex flex-col gap-6">
					{/* Email */}
					<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
						<label className="text-sm text-gray-400 block mb-1">Email</label>
						<p className="text-lg">{userData.email}</p>
					</div>

					{/* Username */}
					<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm text-gray-400 block">Username</label>
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
							<div className="space-y-2">
								<input
									type="text"
									value={username}
									onChange={(e) => handleUsernameChange(e.target.value)}
									className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
										customClass="flex-1 bg-gray-600 hover:bg-gray-500"
										threeD={false}
										onClick={handleCancelEdit}
										disabled={isSaving}
									/>
								</div>
							</div>
						) : (
							<p className="text-lg">{userData.username || 'Not set'}</p>
						)}
					</div>

					{/* Role */}
					<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
						<label className="text-sm text-gray-400 block mb-1">Role</label>
						<p className="text-lg capitalize">{userData.role}</p>
					</div>

					{/* Account Created */}
					{userData.createdAt && (
						<div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
							<label className="text-sm text-gray-400 block mb-1">Account Created</label>
							<p className="text-lg">{new Date(userData.createdAt).toLocaleDateString()}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
