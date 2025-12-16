'use client'

export interface User {
	id: string
	email: string
	role: string
	username?: string
	createdAt?: string
	updatedAt?: string
}

export interface LoginResponse {
	status: string
	data: {
		user: User
		sessionToken: string
	}
}

export interface AuthError {
	status: number
	message: string
	details?: unknown
}

/**
 * Login with Google ID token (proxied through Next.js API)
 */
export const login = async (idToken: string): Promise<LoginResponse> => {
	console.log('idToken', idToken)
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include', // Important: sends cookies
		body: JSON.stringify({ idToken }),
	})

	console.log('response', response)

	if (!response.ok) {
		const error: AuthError = await response.json().catch(() => ({
			status: response.status,
			message: 'Login failed',
		}))
		throw new Error(error.message || 'Login failed')
	}

	return response.json()
}

/**
 * Logout current session (proxied through Next.js API)
 */
export const logout = async (): Promise<void> => {
	const response = await fetch('/api/auth/logout', {
		method: 'POST',
		credentials: 'include', // Important: sends cookies
	})

	if (!response.ok) {
		throw new Error('Logout failed')
	}
}

/**
 * Get current authenticated user (proxied through Next.js API)
 */
export const getCurrentUser = async (): Promise<User | null> => {
	try {
		const response = await fetch('/api/auth/me', {
			method: 'GET',
			credentials: 'include', // Important: sends cookies
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
