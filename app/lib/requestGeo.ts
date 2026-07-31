import type { NextRequest } from 'next/server'

/** Headers commonly set by Cloudflare / Traefik GeoIP / AWS. */
const COUNTRY_HEADERS = [
	'cf-ipcountry',
	'x-geo-country',
	'x-country-code',
	'cloudfront-viewer-country',
] as const

/** ISO 3166-1 alpha-2 country from reverse-proxy headers, or null. */
export const getRequestCountry = (request: NextRequest): string | null => {
	for (const name of COUNTRY_HEADERS) {
		const value = request.headers.get(name)?.trim().toUpperCase()
		if (value && /^[A-Z]{2}$/.test(value) && value !== 'XX' && value !== 'T1') {
			return value
		}
	}
	return null
}

export const getBlockedCountries = (): Set<string> => {
	const raw = process.env.GEO_BLOCK_COUNTRIES || 'SG,CN'
	return new Set(
		raw
			.split(',')
			.map((c) => c.trim().toUpperCase())
			.filter((c) => /^[A-Z]{2}$/.test(c))
	)
}

export const isGeoBlockEnabled = () => process.env.GEO_BLOCK_ENABLED !== 'false'
