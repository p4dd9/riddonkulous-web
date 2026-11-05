import { getBlockedIpMatch } from '@/app/lib/ipBlock'
import {
	isViewSwitcherEnabled,
	isWebPlayEnabled,
	parseViewOverride,
	resolveIsNativeApp,
	VIEW_OVERRIDE_COOKIE,
} from '@/app/lib/nativeApp'
import { collectRequestDebug, isCrawlPath, isRequestDebugLogEnabled } from '@/app/lib/requestDebug'
import { getBlockedCountries, getRequestCountry, isGeoBlockEnabled } from '@/app/lib/requestGeo'
import { serverLogger } from '@/app/util/logger'
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

// Pages a regular browser may open (everything else redirects to the landing
// page). API routes, admin, and any file with an extension (robots.txt,
// sitemap.xml, sw.js, .well-known files) stay reachable.
const BROWSER_PAGES =
	/^\/(privacy-policy|terms-of-service|content-policy|about-us|faq|credits|subscribe|unsubscribe|admin|api|password|403|\.well-known)(\/|$)/

const isBrowserAllowedPath = (pathname: string): boolean =>
	pathname === '/' || BROWSER_PAGES.test(pathname) || /\.[a-z0-9]+$/i.test(pathname)

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
	const isRsc = request.nextUrl.searchParams.has('_rsc')
	const onCrawlPath = isCrawlPath(pathname)

	// Debug log for crawl paths (skip RSC prefetches — too noisy for real users)
	if (onCrawlPath && isRequestDebugLogEnabled() && !isRsc) {
		serverLogger.info(JSON.stringify(collectRequestDebug(request, pathname)))
	}

	// CIDR block (default Aceville/Tencent proxy ranges). Uses X-Forwarded-For /
	// X-Real-IP — works even when geo country headers are missing.
	const blockedCidr = getBlockedIpMatch(request)
	if (blockedCidr) {
		serverLogger.warn(
			JSON.stringify({
				...collectRequestDebug(request, pathname),
				type: 'ip_block',
				blockedCidr,
			})
		)
		return new NextResponse('Forbidden', { status: 403 })
	}

	// Geo-block SG/CN (and any GEO_BLOCK_COUNTRIES). Requires a country header from
	// Traefik GeoIP or Cloudflare — fails open when the header is missing.
	if (isGeoBlockEnabled()) {
		const country = getRequestCountry(request)
		if (country && getBlockedCountries().has(country)) {
			serverLogger.warn(
				JSON.stringify({
					...collectRequestDebug(request, pathname),
					type: 'geo_block',
					blockedCountry: country,
				})
			)
			return new NextResponse('Forbidden', { status: 403 })
		}
	}

	// Local debugging: `?view=app|web|auto` stores the view override cookie and
	// reloads without the param (see ViewSwitcher). Ignored in production unless
	// VIEW_SWITCHER_ENABLED=true.
	const viewParam = request.nextUrl.searchParams.get('view')
	if (isViewSwitcherEnabled() && (viewParam === 'auto' || parseViewOverride(viewParam))) {
		const cleanUrl = request.nextUrl.clone()
		cleanUrl.searchParams.delete('view')
		const response = NextResponse.redirect(cleanUrl)
		if (viewParam === 'auto') {
			response.cookies.delete(VIEW_OVERRIDE_COOKIE)
		} else {
			response.cookies.set(VIEW_OVERRIDE_COOKIE, viewParam as string, { path: '/', sameSite: 'lax' })
		}
		return response
	}

	// Riddle creation and the user area are gone for everyone. Admins sign in
	// through /admin/login instead.
	if (/^\/user\/me(\/|$)/.test(pathname)) {
		return NextResponse.redirect(new URL('/', request.url))
	}
	if (pathname === '/api/riddle/create') {
		return NextResponse.json({ error: 'Not Found' }, { status: 404 })
	}

	const isNativeApp = resolveIsNativeApp(
		request.headers.get('user-agent'),
		request.cookies.get(VIEW_OVERRIDE_COOKIE)?.value
	)

	// The native app is guest-only: newsletter pages (login-gated) redirect home.
	if (isNativeApp && /^\/(subscribe|unsubscribe)(\/|$)/.test(pathname)) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	// Riddonkulous is played in the native app only. A regular browser gets the
	// landing page (/) and the legal/info pages; every other page redirects home.
	if (!isNativeApp && !isWebPlayEnabled() && !isBrowserAllowedPath(pathname)) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	// Handle moderation routes - Requires moderator or admin role
	if (pathname.startsWith('/api/moderation') || pathname.startsWith('/admin/moderation')) {
		const { verifyModeratorAccess } = await import('@/app/lib/moderationAuth')
		const cookieHeader = request.headers.get('cookie') || ''
		const { isModerator } = await verifyModeratorAccess(cookieHeader)

		if (!isModerator) {
			// For API routes, return 403 JSON; for pages, redirect to 403
			if (pathname.startsWith('/api/moderation')) {
				return NextResponse.json({ error: 'Forbidden', message: 'Insufficient permissions' }, { status: 403 })
			}
			return NextResponse.redirect(new URL('/403', request.url))
		}

		return NextResponse.next()
	}

	// Handle admin routes - NEW: Uses Google OAuth with role-based access
	if (pathname.startsWith('/admin')) {
		// Allow login page and logout endpoint
		if (pathname === '/admin/login' || pathname.startsWith('/admin/api/logout')) {
			return NextResponse.next()
		}

		// Check for admin role using new auth system
		const { verifyAdminAccess } = await import('@/app/lib/adminAuth')
		const cookieHeader = request.headers.get('cookie') || ''
		const { isAdmin } = await verifyAdminAccess(cookieHeader)

		if (!isAdmin) {
			// For API routes, return 401 JSON; for pages, redirect to login
			if (pathname.startsWith('/admin/api/')) {
				return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
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
