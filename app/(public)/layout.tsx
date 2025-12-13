import { Footer } from '@/app/components/layout/Footer'
import { Header } from '@/app/components/layout/Header'
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
				{/* Privacy-friendly analytics by Plausible */}
				<script async src="https://plausible.hammertime.studio/js/pa-x-KEXLTn7CNv9VeZQ3Y3C.js"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
					}}
				/>
			</head>
			<body className="antialiased flex flex-col min-h-screen">
				<Header />
				<main className="flex-1 h-full">{children}</main>
				<Footer />
			</body>
		</html>
	)
}


