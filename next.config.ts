import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// The riddle feed was removed; the URL is still indexed (was in the
			// sitemap at priority 0.9) and linked from old shares.
			{
				source: '/riddle-feed',
				destination: '/',
				permanent: true,
			},
		]
	},
	async headers() {
		return [
			{
				source: '/.well-known/assetlinks.json',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/json',
					},
				],
			},
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
				],
			},
		]
	},
}

export default nextConfig
