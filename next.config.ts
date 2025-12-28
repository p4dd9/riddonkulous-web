import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Externalize discord.js and related packages for server-side only
	// These are Node.js-only packages and shouldn't be bundled by Turbopack
	serverExternalPackages: ['discord.js', '@discordjs/ws', 'zlib-sync'],
}

export default nextConfig
