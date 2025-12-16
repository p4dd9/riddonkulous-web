'use client'

export interface UserData {
	id: string
	email: string
	role: string
	username?: string
	createdAt?: string
	updatedAt?: string
}

export interface UpdateUserData {
	username?: string
	email?: string
	role?: 'user' | 'moderator' | 'admin'
}

export interface UserResponse {
	status: string
	data: UserData
	message?: string
}

export interface ErrorResponse {
	status: number
	message: string
	details?: Array<{
		path: string[]
		message: string
	}>
}

/**
 * Get current authenticated user information
 */
export const getCurrentUserData = async (): Promise<UserData | null> => {
	try {
		const response = await fetch('/api/user/me', {
			method: 'GET',
			credentials: 'include',
		})

		if (!response.ok) {
			return null
		}

		const data: UserResponse = await response.json()
		return data.data
	} catch (error) {
		console.error('Error fetching user data:', error)
		return null
	}
}

/**
 * Update user information
 */
export const updateUserData = async (userData: UpdateUserData): Promise<UserResponse> => {
	const response = await fetch('/api/user/me', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(userData),
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to update user',
		}))
		throw error
	}

	return response.json()
}

/**
 * Delete user account
 */
export const deleteUserAccount = async (): Promise<void> => {
	const response = await fetch('/api/user/me', {
		method: 'DELETE',
		credentials: 'include',
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to delete account',
		}))
		throw error
	}
}

/**
 * Validate username format
 */
export const validateUsername = (value: string): string | null => {
	if (value.length < 3) {
		return 'Username must be at least 3 characters'
	}
	if (value.length > 30) {
		return 'Username must be less than 30 characters'
	}

	return null
}
