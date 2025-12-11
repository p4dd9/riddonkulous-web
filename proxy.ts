import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
	matcher: '/admin/:path*',
}

const getSecretKey = () => {
	const secret = process.env.ADMIN_SESSION_SECRET
	if (!secret) {
		throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
	}
	return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (
		pathname === '/admin/login' ||
		pathname.startsWith('/admin/api/login') ||
		pathname.startsWith('/admin/api/logout')
	) {
		return NextResponse.next()
	}

	const sessionCookie = request.cookies.get('riddonk_x')

	if (!sessionCookie) {
		// No session, redirect to login
		return NextResponse.redirect(new URL('/admin/login', request.url))
	}

	try {
		const { payload } = await jwtVerify(sessionCookie.value, getSecretKey())

		if (payload.authenticated !== true) {
			return NextResponse.redirect(new URL('/admin/login', request.url))
		}
	} catch {
		return NextResponse.redirect(new URL('/admin/login', request.url))
	}

	return NextResponse.next()
}
