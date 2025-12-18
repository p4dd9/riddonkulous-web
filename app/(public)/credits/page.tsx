import { CreditsContent } from '@/app/components/credits/CreditsContent'

export const revalidate = false // Static page

export default async function CreditsPage() {

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<CreditsContent />
		</div>
	)
}
