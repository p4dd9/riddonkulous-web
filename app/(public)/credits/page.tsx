import { CreditsContent } from '@/app/components/credits/CreditsContent'
import { cacheLife } from 'next/cache'

export default function CreditsPage() {
	'use cache'
	cacheLife('max') // Cache for maximum duration (365 days)

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<CreditsContent />
		</div>
	)
}
