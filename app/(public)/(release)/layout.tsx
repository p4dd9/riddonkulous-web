import type { Metadata } from 'next'
import Head from 'next/head'
import '../../globals.css'

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
			<Head>
				<meta charSet="UTF-8" />
				{/* Adding Google AdSense script directly */}
				<script
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6902354361648358`}
					async
				/>
			</Head>

			<body className="antialiased">{children}</body>
		</html>
	)
}
