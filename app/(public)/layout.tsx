import { Footer } from '@/app/components/layout/Footer'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
	title: 'Riddonkulous | Create and Solve Riddles',
	description: 'Riddonkulous is a platform for creating and solving riddles.',
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
			</head>
			<body className="antialiased flex flex-col min-h-screen">
				<main className="flex-1 h-full">{children}</main>
				<Footer />
			</body>
		</html>
	)
}
