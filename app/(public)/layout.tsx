import { Footer } from '@/app/components/layout/Footer'
import { Header } from '@/app/components/layout/Header'
import { AuthProvider } from '@/app/contexts/AuthContext'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
	metadataBase: new URL('https://riddonkulous.com'),
	title: {
		default: 'Riddonkulous | Create and Solve Riddles',
		template: '%s | Riddonkulous',
	},
	description:
		'Riddonkulous is a platform for creating and solving riddles. Join our community to create, share, and solve engaging riddles every day.',
	keywords: [
		'riddles',
		'puzzles',
		'brain teasers',
		'riddle solving',
		'riddle creation',
		'riddle community',
		'riddonkulous',
		'daily riddles',
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
		title: 'Riddonkulous | Create and Solve Riddles',
		description:
			'Riddonkulous is a platform for creating and solving riddles. Join our community to create, share, and solve engaging riddles every day.',
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
		title: 'Riddonkulous | Create and Solve Riddles',
		description:
			'Riddonkulous is a platform for creating and solving riddles. Join our community to create, share, and solve engaging riddles every day.',
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6902354361648358"
					crossOrigin="anonymous"
				/>
				{/* Privacy-friendly analytics by Plausible */}
				<script async src="https://plausible.hammertime.studio/js/pa-x-KEXLTn7CNv9VeZQ3Y3C.js"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
					}}
				/>
				{/* Google OAuth */}
				<script src="https://accounts.google.com/gsi/client" async></script>
			</head>
			<body className="antialiased flex flex-col min-h-screen">
				<AuthProvider>
					<Header />
					<main className="flex-1 h-full">{children}</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	)
}
