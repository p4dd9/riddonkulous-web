import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { StructuredData } from '@/app/components/seo/StructuredData'
import { getRiddleByPostId } from '@/app/services/riddleService'
import type { Metadata } from 'next'

interface RiddlePageProps {
	params: Promise<{
		postId: string
	}>
}

export const generateMetadata = async ({ params }: RiddlePageProps): Promise<Metadata> => {
	const { postId } = await params
	const riddle = await getRiddleByPostId(postId)

	const title = riddle.title || riddle.riddle?.substring(0, 60) || 'Riddle'
	const description = riddle.title
		? `${riddle.riddle?.substring(0, 120) || ''} Think you know the answer?`
		: `${riddle.riddle?.substring(0, 120) || "Here's a tricky one"} Can you crack it?`

	const url = `https://riddonkulous.com/riddle/${postId}`

	return {
		title: `${title} | Riddonkulous`,
		description,
		openGraph: {
			title: `${title} | Riddles with Answers`,
			description: `${description} Riddle with answer included.`,
			type: 'article',
			url,
			images: [
				{
					url: '/web-app-manifest-512x512.png',
					width: 512,
					height: 512,
					alt: title || 'Riddle with answer',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${title} | Riddles with Answers`,
			description: `${description} Riddle with answer included.`,
			images: ['/web-app-manifest-512x512.png'],
		},
		alternates: {
			canonical: url,
		},
	}
}

export const revalidate = 86400 // Cache for 1 day (24 hours)

export default async function RiddlePage({ params }: RiddlePageProps) {
	const { postId } = await params

	const riddle = await getRiddleByPostId(postId)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: riddle.title || `Riddle: ${riddle.riddle?.substring(0, 60) || 'Brain Teaser'}`,
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
		// Add FAQPage structured data for riddles with answers
		...(riddle.word && {
			mainEntity: {
				'@type': 'FAQPage',
				mainEntity: {
					'@type': 'Question',
					name: riddle.title || riddle.riddle?.substring(0, 100) || 'Riddle',
					text: riddle.riddle || '',
					acceptedAnswer: {
						'@type': 'Answer',
						text: riddle.word,
					},
				},
			},
		}),
	}

	return (
		<>
			<StructuredData data={structuredData} />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8">
				<GoogleAdDisplayUnitHorizontal />
				<GoogleAdMobileBanner customClasses="mt-[-32px] mb-2" />

				<RiddleSingleView riddle={riddle} showDate={true} showRedditButton={true} showShareButton={true} />
				{/* <RiddleSingleView riddle={riddle} showDate={true} showRedditButton={true} showShareButton={true} /> */}
			</div>
		</>
	)
}
