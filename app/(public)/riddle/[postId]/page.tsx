import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { StructuredData } from '@/app/components/seo/StructuredData'
import { FetcherError } from '@/app/schemas/FetchError'
import { getRiddleByPostId } from '@/app/services/riddleService'
import { stripSolution } from '@/app/util/stripSolution'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface RiddlePageProps {
	params: Promise<{
		postId: string
	}>
}

/** Reddit (t3_*) or web-created (r_*) post ids — reject bot junk like robots.txt early. */
const isValidRiddlePostId = (postId: string) => /^(t3_|r_)[A-Za-z0-9_-]+$/.test(postId)

const loadRiddleOrNotFound = async (postId: string) => {
	if (!isValidRiddlePostId(postId)) {
		notFound()
	}

	try {
		return await getRiddleByPostId(postId)
	} catch (error) {
		if (error instanceof FetcherError && error.status === 404) {
			notFound()
		}
		throw error
	}
}

export const generateMetadata = async ({ params }: RiddlePageProps): Promise<Metadata> => {
	const { postId } = await params

	if (!isValidRiddlePostId(postId)) {
		return {
			title: 'Riddle Not Found | Riddonkulous',
			description: 'The requested riddle could not be found.',
		}
	}

	try {
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
	} catch {
		return {
			title: 'Riddle Not Found | Riddonkulous',
			description: 'The requested riddle could not be found.',
		}
	}
}

export const revalidate = 86400 // Cache for 1 day (24 hours)

export default async function RiddlePage({ params }: RiddlePageProps) {
	const { postId } = await params

	const riddle = await loadRiddleOrNotFound(postId)

	const safeRiddle = stripSolution(riddle)

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
	}

	return (
		<>
			<StructuredData data={structuredData} />
			<GoogleAdVerticalFixed />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8">
				<GoogleAdDisplayUnitHorizontal />
				<GoogleAdMobileBanner customClasses="mt-[-32px] mb-2" />

				<RiddleSingleView riddle={safeRiddle} showDate={true} showRedditButton={true} showShareButton={true} />
			</div>
		</>
	)
}
