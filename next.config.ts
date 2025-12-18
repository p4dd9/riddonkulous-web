import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	cacheComponents: true,
	cacheLife: {
		'12hours': {
			stale: 300, // 5 minutes (client-side cache)
			revalidate: 43200, // 12 hours
			expire: 86400, // 24 hours
		},
	},
}

export default nextConfig
