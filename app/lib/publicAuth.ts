'use server'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const PUBLIC_PASSWORD = process.env.PUBLIC_PASSWORD
const PUBLIC_SESSION_COOKIE_NAME = 'riddonk_public_access'
const PUBLIC_SESSION_SECRET = process.env.PUBLIC_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET

if (!PUBLIC_SESSION_SECRET) {
	throw new Error('PUBLIC_SESSION_SECRET or ADMIN_SESSION_SECRET environment variable is not set')
}

// Get the secret key for JWT signing/verification
const getSecretKey = () => {
	return new TextEncoder().encode(PUBLIC_SESSION_SECRET)
}

export const verifyPublicAccess = async (): Promise<boolean> => {
	if (!PUBLIC_PASSWORD) {
		// If no password is set, allow access
		return true
	}

	try {
		const cookieStore = await cookies()
		const sessionCookie = cookieStore.get(PUBLIC_SESSION_COOKIE_NAME)

		if (!sessionCookie) {
			return false
		}

		const { payload } = await jwtVerify(sessionCookie.value, getSecretKey())

		return payload.authenticated === true
	} catch {
		return false
	}
}

export const loginPublic = async (password: string): Promise<{ success: boolean; error?: string }> => {
	if (!PUBLIC_PASSWORD) {
		// If no password is set, allow access
		return { success: true }
	}

	if (password === PUBLIC_PASSWORD) {
		const cookieStore = await cookies()

		const token = await new SignJWT({ authenticated: true })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('7d') // 7 days expiration
			.sign(getSecretKey())

		cookieStore.set(PUBLIC_SESSION_COOKIE_NAME, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		})

		return { success: true }
	}

	return { success: false, error: 'Invalid password' }
}

