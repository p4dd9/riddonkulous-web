import { AppInstallBanner } from '@/app/components/AppInstallBanner'
import { AppInstallBannerIOS } from '@/app/components/AppInstallBannerIOS'
import { Footer } from '@/app/components/layout/Footer'
import { Header } from '@/app/components/layout/Header'
import { RateAppModalProvider } from '@/app/components/modals/RateAppModalProvider'
import { ViewSwitcher } from '@/app/components/dev/ViewSwitcher'
import { NativeBridge } from '@/app/components/NativeBridge'
import { ServiceWorkerUnregister } from '@/app/components/ServiceWorkerUnregister'
import { AuthProvider } from '@/app/contexts/AuthContext'
import { canPlayRequest, getViewOverrideRequest, isNativeAppRequest, isViewSwitcherEnabled } from '@/app/lib/nativeApp'
import { getCurrentUserServer } from '@/app/lib/serverAuth'
import type { Tag } from '@/app/services/tagService'
import { listTags } from '@/app/services/tagService'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import '../globals.css'

export const metadata: Metadata = {
	metadataBase: new URL('https://riddonkulous.com'),
	title: {
		default: 'Riddonkulous | Riddle Game for iOS and Android',
		template: '%s | Riddonkulous',
	},
	description:
		'Riddonkulous is a riddle game for iOS and Android: 1,000 community riddles, boss riddles and themed campaigns. Free, offline, and family-friendly.',
	keywords: [
		'riddles',
		'riddles with answers',
		'riddle',
		'brain teasers',
		'logic puzzles',
		'word riddles',
		'tricky riddles',
		'fun riddles',
		'hard riddles',
		'daily riddles',
		'wordplay',
		'lateral thinking',
		'guessing game',
		'mind games',
		'puzzle questions',
		'trick questions',
		'riddle solving',
		'riddle creation',
		'riddle community',
		'riddonkulous',
	],
	authors: [{ name: 'Hammertime e.U.' }],
	creator: 'Hammertime e.U.',
	publisher: 'Hammertime e.U.',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://riddonkulous.com',
		siteName: 'Riddonkulous',
		title: 'Riddonkulous | Riddle Game for iOS and Android',
		description:
			'1,000 community riddles, boss riddles and themed campaigns in a free riddle game for iOS and Android. See if you can crack them.',
		images: [
			{
				url: '/web-app-manifest-512x512.png',
				width: 512,
				height: 512,
				alt: 'Riddonkulous Logo',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Riddonkulous | Riddle Game for iOS and Android',
		description:
			'1,000 community riddles, boss riddles and themed campaigns in a free riddle game for iOS and Android. See if you can crack them.',
		images: ['/web-app-manifest-512x512.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		// Add Google Search Console verification when available
		// google: 'your-verification-code',
	},
	alternates: {
		canonical: 'https://riddonkulous.com',
	},
	category: 'Entertainment',
}

// Cache tags using Next.js unstable_cache for cross-request caching
// Tags don't change frequently, so cache for 1 hour (3600 seconds)
// This works even with dynamic layouts and reduces API calls
const getCachedTags = unstable_cache(
	async (): Promise<Tag[]> => {
		const tagsData = await listTags(50, 0)
		return tagsData.tags.sort((a, b) => {
			const orderA = a.order ?? Number.MAX_SAFE_INTEGER
			const orderB = b.order ?? Number.MAX_SAFE_INTEGER
			if (orderA !== orderB) {
				return orderA - orderB
			}
			return a.label.localeCompare(b.label)
		})
	},
	['tags'], // Cache key
	{
		revalidate: 3600, // Revalidate every hour (3600 seconds)
		tags: ['tags'], // Cache tag for manual invalidation if needed
	}
)

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	// The native app is guest-only: skip the session lookup entirely (cookies
	// are ignored) and render without any auth UI.
	const [isNativeApp, canPlay, viewOverride] = await Promise.all([
		isNativeAppRequest(),
		canPlayRequest(),
		getViewOverrideRequest(),
	])
	const [sortedTags, initialUser] = await Promise.all([
		canPlay ? getCachedTags() : Promise.resolve([]),
		isNativeApp ? Promise.resolve(null) : getCurrentUserServer(),
	])

	return (
		<html lang="en">
			<head>
				{/* Apple Touch Icon */}
				<link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
				{/* Theme Color */}
				<meta name="theme-color" content="#ffffff" />
				{/* Privacy-friendly analytics by Plausible */}
				<script async src="https://plausible.hammertime.studio/js/pa-x-KEXLTn7CNv9VeZQ3Y3C.js"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
					}}
				/>
				{/* Google OAuth: only the newsletter pages (/subscribe, /unsubscribe, reached from emails) still sign in */}
				{!isNativeApp && <script src="https://accounts.google.com/gsi/client" async></script>}
			</head>
			<body className="antialiased flex flex-col min-h-screen">
				<AuthProvider initialUser={initialUser} isNativeApp={isNativeApp}>
					<ServiceWorkerUnregister />
					<NativeBridge />
					<AppInstallBanner />
					<AppInstallBannerIOS />
					{/* Browsers get the bare landing page: no header at all */}
					{canPlay && <Header tags={sortedTags} />}
					<main className="flex-1 h-full">{children}</main>
					<Footer />
					<RateAppModalProvider />
					{isViewSwitcherEnabled() && (
						<ViewSwitcher override={viewOverride} isNativeApp={isNativeApp} canPlay={canPlay} />
					)}
				</AuthProvider>
			</body>
		</html>
	)
}
