import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { StructuredData } from '@/app/components/seo/StructuredData'
import { getRiddleByPostId } from '@/app/services/riddleService'
import type { Metadata } from 'next'

interface RiddlePageProps {
	params: Promise<{
		postId: string
	}>
}

export const revalidate = 86400 // 24 hours

export const generateMetadata = async ({ params }: RiddlePageProps): Promise<Metadata> => {
	const { postId } = await params
	const riddle = await getRiddleByPostId(postId)

	const title = riddle.title || riddle.riddle?.substring(0, 60) || 'Riddle'
	const description = riddle.title
		? `Solve this riddle: ${riddle.riddle?.substring(0, 150) || ''}`
		: riddle.riddle?.substring(0, 150) || 'Challenge yourself with this riddle on Riddonkulous!'

	const url = `https://riddonkulous.com/riddle/${postId}`

	return {
		title: `${title} | Riddonkulous`,
		description,
		openGraph: {
			title: `${title} | Riddonkulous`,
			description,
			type: 'article',
			url,
			images: [
				{
					url: '/web-app-manifest-512x512.png',
					width: 512,
					height: 512,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${title} | Riddonkulous`,
			description,
			images: ['/web-app-manifest-512x512.png'],
		},
		alternates: {
			canonical: url,
		},
	}
}

export default async function RiddlePage({ params }: RiddlePageProps) {
	const { postId } = await params

	const riddle = await getRiddleByPostId(postId)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: riddle.title || riddle.riddle?.substring(0, 100) || 'Riddle',
		description: riddle.riddle || '',
		author: {
			'@type': 'Person',
			name: riddle.author || 'Anonymous',
		},
		datePublished: riddle.date ? new Date(Number(riddle.date)).toISOString() : undefined,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://riddonkulous.com/riddle/${postId}`,
		},
	}

	return (
		<>
			<StructuredData data={structuredData} />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8">
				<RiddleSingleView riddle={riddle} showDate={true} showRedditButton={true} showShareButton={true} />
			</div>
		</>
	)
}
