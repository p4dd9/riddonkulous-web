import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Credits | Riddonkulous',
	description: 'The riddle authors, artists and contributors behind the Riddonkulous app and website.',
	openGraph: {
		title: 'Credits | Riddonkulous',
		description: 'The riddle authors, artists and contributors behind the Riddonkulous app and website.',
		url: 'https://riddonkulous.com/credits',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Credits | Riddonkulous',
		description: 'The riddle authors, artists and contributors behind the Riddonkulous app and website.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/credits',
	},
}

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
	return children
}





















