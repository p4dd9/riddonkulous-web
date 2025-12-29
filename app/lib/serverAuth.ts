'use server'

import { getApiBaseUrl } from '@/app/util/apiConfig'
import { cookies } from 'next/headers'

// Server-side User type - compatible with client-side User type from auth.ts
// Includes all fields that may be returned from the API
export interface ServerUser {
	id: string
	email: string
	role: string
	name?: string
	avatar?: string
	username?: string
	createdAt?: string
	updatedAt?: string
}

/**
 * Get current authenticated user from backend (server-side)
 * Used for initial rendering to avoid client-side 401 calls
 * Returns a user object compatible with the client-side User type
 */
export const getCurrentUserServer = async (requestCookieHeader?: string): Promise<ServerUser | null> => {
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
		// Silently fail - user is not authenticated
		// Don't log errors for unauthenticated users to avoid noise
		return null
	}
}

