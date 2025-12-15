import { CreditsContent } from '@/app/components/credits/CreditsContent'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
	title: 'About Us | Riddonkulous',
	description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
	openGraph: {
		title: 'About Us | Riddonkulous',
		description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
		url: 'https://riddonkulous.com/about-us',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'About Us | Riddonkulous',
		description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/about-us',
	},
}

export default function AboutUsPage() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<CreditsContent />
		</div>
	)
}

