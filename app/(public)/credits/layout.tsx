import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Credits | Riddonkulous',
	description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
	openGraph: {
		title: 'Credits | Riddonkulous',
		description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
		url: 'https://riddonkulous.com/credits',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Credits | Riddonkulous',
		description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/credits',
	},
}

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
	return children
}















