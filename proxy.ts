import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|otf|ttf|woff|woff2|json|webmanifest)).*)',
	],
}

const getAdminSecretKey = () => {
	const secret = process.env.ADMIN_SESSION_SECRET
	if (!secret) {
		throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
	}
	return new TextEncoder().encode(secret)
}

const getPublicSecretKey = () => {
	const secret = process.env.PUBLIC_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET
	if (!secret) {
		return null
	}
	return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Handle admin routes
	if (pathname.startsWith('/admin')) {
		if (
			pathname === '/admin/login' ||
			pathname.startsWith('/admin/api/login') ||
			pathname.startsWith('/admin/api/logout')
		) {
			return NextResponse.next()
		}

		const sessionCookie = request.cookies.get('riddonk_x')

		if (!sessionCookie) {
			// For API routes, return 401 JSON; for pages, redirect to login
			if (pathname.startsWith('/admin/api/')) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			}
			return NextResponse.redirect(new URL('/admin/login', request.url))
		}

		try {
			const { payload } = await jwtVerify(sessionCookie.value, getAdminSecretKey())

			if (payload.authenticated !== true) {
				// For API routes, return 401 JSON; for pages, redirect to login
				if (pathname.startsWith('/admin/api/')) {
					return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
				}
				return NextResponse.redirect(new URL('/admin/login', request.url))
			}
		} catch {
			// For API routes, return 401 JSON; for pages, redirect to login
			if (pathname.startsWith('/admin/api/')) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			}
			return NextResponse.redirect(new URL('/admin/login', request.url))
		}

		return NextResponse.next()
	}

	// Handle public password protection
	// TEMPORARY: Set to true to disable password protection
	const DISABLE_PASSWORD_PROTECTION = true

	const PUBLIC_PASSWORD = process.env.PUBLIC_PASSWORD
	const PUBLIC_SESSION_COOKIE_NAME = 'riddonk_public_access'

	// Skip password check if disabled or no password is set
	if (DISABLE_PASSWORD_PROTECTION || !PUBLIC_PASSWORD) {
		return NextResponse.next()
	}

	// Allow access to password page and API routes
	if (pathname === '/password' || pathname.startsWith('/api/')) {
		return NextResponse.next()
	}

	const sessionCookie = request.cookies.get(PUBLIC_SESSION_COOKIE_NAME)

	if (!sessionCookie) {
		// No session, redirect to password page
		return NextResponse.redirect(new URL('/password', request.url))
	}

	const secretKey = getPublicSecretKey()
	if (!secretKey) {
		return NextResponse.next()
	}

	try {
		const { payload } = await jwtVerify(sessionCookie.value, secretKey)

		if (payload.authenticated !== true) {
			return NextResponse.redirect(new URL('/password', request.url))
		}
	} catch {
		// Invalid token, redirect to password page
		return NextResponse.redirect(new URL('/password', request.url))
	}

	return NextResponse.next()
}
