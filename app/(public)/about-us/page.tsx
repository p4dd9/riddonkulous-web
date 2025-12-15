import { CreditsContent } from '@/app/components/credits/CreditsContent'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
	title: 'About Us | Riddonkulous',
	description: 'Learn about the contributors, authors, and special thanks behind Riddonkulous.',
}

export default function AboutUsPage() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<CreditsContent />
		</div>
	)
}

