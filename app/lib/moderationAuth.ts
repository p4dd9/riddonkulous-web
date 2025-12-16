'use server'

import { getApiBaseUrl } from '@/app/util/apiConfig'
import { cookies } from 'next/headers'

interface User {
	id: string
	email: string
	name?: string
	avatar?: string
	role: string
}

/**
 * Get current authenticated user from backend (server-side)
 */
const getCurrentUser = async (requestCookieHeader?: string): Promise<User | null> => {
	try {
		const apiBaseUrl = await getApiBaseUrl()
		const authApiUrl = `${apiBaseUrl}/auth/me`

		// Use provided cookie header or get from cookies()
		let cookieHeader = requestCookieHeader
		if (!cookieHeader) {
			const cookieStore = await cookies()
			const cookieArray: string[] = []
			cookieStore.getAll().forEach((cookie) => {
				cookieArray.push(`${cookie.name}=${cookie.value}`)
			})
			cookieHeader = cookieArray.join('; ')
		}

		const response = await fetch(authApiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			return null
		}

		const data = await response.json()
		return data.data.user
	} catch (error) {
		console.error('Error fetching current user:', error)
		return null
	}
}

/**
 * Check if the current user is a moderator or admin
 * Uses the new Google OAuth session system
 */
export const verifyModeratorAccess = async (
	requestCookieHeader?: string
): Promise<{ isModerator: boolean; user?: User }> => {
	try {
		const user = await getCurrentUser(requestCookieHeader)

		if (!user) {
			return { isModerator: false }
		}

		// Check if user has moderator or admin role
		if (user.role === 'moderator' || user.role === 'admin') {
			return { isModerator: true, user }
		}

		return { isModerator: false, user }
	} catch (error) {
		console.error('Error verifying moderator access:', error)
		return { isModerator: false }
	}
}

/**
 * Require moderator access - throws error if not moderator/admin
 */
export const requireModerator = async (requestCookieHeader?: string): Promise<User> => {
	const { isModerator, user } = await verifyModeratorAccess(requestCookieHeader)

	if (!isModerator || !user) {
		throw new Error('Moderator access required')
	}

	return user
}

