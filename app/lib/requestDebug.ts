import { getClientIp } from '@/app/lib/clientIp'
import { getRequestCountry } from '@/app/lib/requestGeo'
import type { NextRequest } from 'next/server'

export const isCrawlPath = (pathname: string) =>
	pathname === '/riddles' ||
	pathname.startsWith('/riddles/') ||
	pathname === '/riddle' ||
	pathname.startsWith('/riddle/')

/** Opt-in: set REQUEST_DEBUG_LOG=true to log crawl-path debug headers. */
export const isRequestDebugLogEnabled = () => process.env.REQUEST_DEBUG_LOG === 'true'

/** Collect headers useful for debugging scrapers / geo blocks. */
export const collectRequestDebug = (request: NextRequest, pathname: string) => ({
	type: 'request_debug' as const,
	ip: getClientIp(request),
	forwardedFor: request.headers.get('x-forwarded-for'),
	realIp: request.headers.get('x-real-ip'),
	country: getRequestCountry(request),
	path: pathname,
	method: request.method,
	rsc: request.nextUrl.searchParams.has('_rsc'),
	ua: request.headers.get('user-agent'),
	referer: request.headers.get('referer'),
	acceptLanguage: request.headers.get('accept-language'),
	accept: request.headers.get('accept'),
	origin: request.headers.get('origin'),
})
