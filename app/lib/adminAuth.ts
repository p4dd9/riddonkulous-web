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
 * Check if the current user is an admin
 * Uses the new Google OAuth session system
 */
export const verifyAdminAccess = async (requestCookieHeader?: string): Promise<{ isAdmin: boolean; user?: User }> => {
	try {
		const user = await getCurrentUser(requestCookieHeader)

		if (!user) {
			return { isAdmin: false }
		}

		// Check if user has admin role
		if (user.role === 'admin') {
			return { isAdmin: true, user }
		}

		return { isAdmin: false, user }
	} catch (error) {
		console.error('Error verifying admin access:', error)
		return { isAdmin: false }
	}
}

/**
 * Require admin access - throws error if not admin
 */
export const requireAdmin = async (requestCookieHeader?: string): Promise<User> => {
	const { isAdmin, user } = await verifyAdminAccess(requestCookieHeader)

	if (!isAdmin || !user) {
		throw new Error('Admin access required')
	}

	return user
}
