import { GoogleAdsense } from '@/app/components/GoogleAdsense'
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
				<GoogleAdsense />
			</head>
			<body className="antialiased">{children}</body>
		</html>
	)
}
