import type { Metadata } from 'next'

const description =
	'Answers to common questions about the Riddonkulous app for iOS and Android: how to play, ads and purchases, campaigns, keeping your progress and contacting us.'

export const metadata: Metadata = {
	title: 'FAQ | Frequently Asked Questions',
	description,
	openGraph: {
		title: 'FAQ | Frequently Asked Questions | Riddonkulous',
		description,
		url: 'https://riddonkulous.com/faq',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'FAQ | Frequently Asked Questions | Riddonkulous',
		description: 'Answers to common questions about the Riddonkulous app.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/faq',
	},
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
	return children
}
