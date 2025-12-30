import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'FAQ | Frequently Asked Questions',
	description: 'Find answers to frequently asked questions about Riddonkulous, how to use the platform, create riddles, and participate in the community.',
	openGraph: {
		title: 'FAQ | Frequently Asked Questions | Riddonkulous',
		description: 'Find answers to frequently asked questions about Riddonkulous, how to use the platform, create riddles, and participate in the community.',
		url: 'https://riddonkulous.com/faq',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'FAQ | Frequently Asked Questions | Riddonkulous',
		description: 'Find answers to frequently asked questions about Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/faq',
	},
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
	return children
}
















