'use client'

import { validateProfanity } from '../util/profanityFilter'

export interface UserData {
	id: string
	email: string
	role: string
	username?: string
	avatar?: string
	emailSubscription?: boolean
	createdAt?: string
	updatedAt?: string
}

export interface UpdateUserData {
	username?: string
	email?: string
	avatar?: string
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

	// Check for profanity
	const profanityError = validateProfanity(value, 'Username')
	if (profanityError) {
		return profanityError
	}

	return null
}

export interface UserRiddle {
	postId: string
	type?: string
	author?: string
	userid: string
	word: string
	riddle: string
	bg?: string
	explanation?: string
	status: 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'REMOVED'
	score: number
	tags: string[]
	createdAt: string
	updatedAt: string
}

export interface GetUserRiddlesResponse {
	status: 'success'
	data: {
		riddles: UserRiddle[]
		limit: number
		offset: number
	}
}

/**
 * Get current user's riddles
 */
export const getMyRiddles = async (limit: number = 20, offset: number = 0): Promise<GetUserRiddlesResponse> => {
	const params = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
	})

	const response = await fetch(`/api/user/me/riddles?${params}`, {
		credentials: 'include',
	})

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error('Unauthorized - Please log in')
		}
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to fetch riddles',
		}))
		throw error
	}

	return response.json()
}

/**
 * Subscribe to email newsletter
 */
export const subscribeToNewsletter = async (): Promise<UserResponse> => {
	const response = await fetch('/api/user/me/subscribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to subscribe to email newsletter',
		}))
		throw error
	}

	return response.json()
}

/**
 * Unsubscribe from email newsletter
 */
export const unsubscribeFromNewsletter = async (): Promise<UserResponse> => {
	const response = await fetch('/api/user/me/unsubscribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to unsubscribe from email newsletter',
		}))
		throw error
	}

	return response.json()
}
