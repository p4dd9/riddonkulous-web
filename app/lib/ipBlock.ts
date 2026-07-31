import { getClientIp } from '@/app/lib/clientIp'
import type { NextRequest } from 'next/server'

interface ParsedCidr {
	network: number
	mask: number
	raw: string
}

const IPV4_OCTET = /^(?:0|[1-9]\d{0,2})$/

/** Aceville / Tencent proxy egress used by the objects-category scraper. */
export const BLOCKED_CIDRS = ['43.172.0.0/16', '43.173.0.0/16'] as const

/** Parse IPv4 dotted quad to a 32-bit unsigned int, or null if invalid. */
export const ipv4ToInt = (ip: string): number | null => {
	const parts = ip.split('.')
	if (parts.length !== 4) {
		return null
	}

	let value = 0
	for (const part of parts) {
		if (!IPV4_OCTET.test(part)) {
			return null
		}
		const octet = Number(part)
		if (octet > 255) {
			return null
		}
		value = (value << 8) + octet
	}

	return value >>> 0
}

/** Parse `a.b.c.d/nn` (IPv4 only). Bare IPs are treated as /32. */
export const parseCidr = (raw: string): ParsedCidr | null => {
	const trimmed = raw.trim()
	if (!trimmed) {
		return null
	}

	const slash = trimmed.indexOf('/')
	const ipPart = slash === -1 ? trimmed : trimmed.slice(0, slash)
	const prefixPart = slash === -1 ? undefined : trimmed.slice(slash + 1)

	const ipInt = ipv4ToInt(ipPart)
	if (ipInt === null) {
		return null
	}

	const prefix = prefixPart === undefined ? 32 : Number.parseInt(prefixPart, 10)
	if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
		return null
	}

	const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
	return {
		network: (ipInt & mask) >>> 0,
		mask,
		raw: trimmed,
	}
}

export const ipMatchesCidr = (ip: string, cidr: ParsedCidr): boolean => {
	const ipInt = ipv4ToInt(ip)
	if (ipInt === null) {
		return false
	}
	return (ipInt & cidr.mask) >>> 0 === cidr.network
}

const parsedBlockedCidrs: ParsedCidr[] = BLOCKED_CIDRS.map((cidr) => {
	const parsed = parseCidr(cidr)
	if (!parsed) {
		throw new Error(`Invalid BLOCKED_CIDRS entry: ${cidr}`)
	}
	return parsed
})

export const findBlockedCidr = (ip: string | null): ParsedCidr | null => {
	if (!ip) {
		return null
	}
	return parsedBlockedCidrs.find((cidr) => ipMatchesCidr(ip, cidr)) ?? null
}

/** Returns the matched CIDR string when the client IP is blocked, else null. */
export const getBlockedIpMatch = (request: NextRequest): string | null =>
	findBlockedCidr(getClientIp(request))?.raw ?? null
