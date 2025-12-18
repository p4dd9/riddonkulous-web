import { CreditsContent } from '@/app/components/credits/CreditsContent'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

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

export default async function AboutUsPage() {
	'use cache'
	cacheLife('max') // Cache for maximum duration (365 days)

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<CreditsContent />
		</div>
	)
}
