import { RelatedResources } from '@/app/components/articles/RelatedResources'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Community Interview | Riddonkulous',
	description:
		'Get to know the amazing members of our community through interviews and stories from fellow riddle enthusiasts.',
}

export const revalidate = false // Static page

export default async function CommunityInterview() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col max-w-4xl mx-auto px-4 py-8 gap-8">
			<h1 className="text-3xl md:text-4xl text-center mb-2">Community Interview</h1>

			{/* Content Blocks */}
			<article className="w-full flex flex-col gap-6 text-base md:text-lg leading-relaxed">
				<p className="text-center text-gray-400 italic">
					This page is coming soon. Check back later for community interviews and stories!
				</p>
			</article>

			<RelatedResources excludePage="community-interview" />
		</div>
	)
}
