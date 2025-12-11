'use server'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_COOKIE_NAME = 'riddonk_x'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET

if (!SESSION_SECRET) {
	throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
}

// Get the secret key for JWT signing/verification
const getSecretKey = () => {
	return new TextEncoder().encode(SESSION_SECRET)
}

export const verifyAdminSession = async (): Promise<boolean> => {
	const cookieStore = await cookies()
	const session = cookieStore.get(SESSION_COOKIE_NAME)

	if (!session) {
		return false
	}

	try {
		const { payload } = await jwtVerify(session.value, getSecretKey())
		return payload.authenticated === true
	} catch {
		return false
	}
}

export const loginAdmin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
	if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		const cookieStore = await cookies()

		const token = await new SignJWT({ authenticated: true })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('7d') // 7 days expiration
			.sign(getSecretKey())

		cookieStore.set(SESSION_COOKIE_NAME, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		})

		return { success: true }
	}

	return { success: false, error: 'Invalid username or password' }
}

export const logoutAdmin = async (): Promise<void> => {
	const cookieStore = await cookies()
	cookieStore.delete(SESSION_COOKIE_NAME)
	redirect('/admin/login')
}

export const requireAdmin = async (): Promise<void> => {
	const isAuthenticated = await verifyAdminSession()
	if (!isAuthenticated) {
		redirect('/admin/login')
	}
}
