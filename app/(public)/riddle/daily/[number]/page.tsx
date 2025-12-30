import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { StructuredData } from '@/app/components/seo/StructuredData'
import { getRiddleByNumber, getRiddleOfTheDay } from '@/app/services/riddleService'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'

interface DailyRiddlePageProps {
	params: Promise<{
		number: string
	}>
}

export const generateMetadata = async ({ params }: DailyRiddlePageProps): Promise<Metadata> => {
	const { number } = await params
	const riddleNumber = parseInt(number, 10)

	if (isNaN(riddleNumber) || riddleNumber < 1) {
		return {
			title: 'Daily Riddles | Riddles with Answers',
			description:
				'New riddle every day, with answers. Brain teasers, logic puzzles, and tricky riddles. Fresh daily.',
		}
	}

	try {
		const riddle = await getRiddleByNumber()
		const title = riddle.title || riddle.riddle?.substring(0, 60) || `Daily Riddle #${riddleNumber}`
		const description = riddle.title
			? `${riddle.riddle?.substring(0, 120) || ''} Think you know the answer?`
			: `Daily Riddle #${riddleNumber}: ${riddle.riddle?.substring(0, 120) || "Here's today's brain teaser"} Can you crack it?`

		const url = `https://riddonkulous.com/riddle/daily/${riddleNumber}`

		return {
			title: `${title} | Daily Riddles`,
			description,
			openGraph: {
				title: `${title} | Daily Riddles with Answers`,
				description: `${description} Answer included.`,
				type: 'article',
				url,
				images: [
					{
						url: '/web-app-manifest-512x512.png',
						width: 512,
						height: 512,
						alt: title || 'Daily riddle with answer',
					},
				],
			},
			twitter: {
				card: 'summary_large_image',
				title: `${title} | Daily Riddles with Answers`,
				description: `${description} Answer included.`,
				images: ['/web-app-manifest-512x512.png'],
			},
			alternates: {
				canonical: url,
			},
		}
	} catch {
		return {
			title: 'Daily Riddles | Riddles with Answers',
			description:
				'New riddle every day, with answers. Brain teasers, logic puzzles, and tricky riddles. Fresh daily.',
		}
	}
}

export const revalidate = 3600 // Cache for 1 hour

export default async function DailyRiddlePage({ params }: DailyRiddlePageProps) {
	const { number } = await params
	const riddleNumber = parseInt(number, 10)

	if (isNaN(riddleNumber) || riddleNumber < 1) {
		redirect('/')
	}

	let riddle
	try {
		riddle = await getRiddleByNumber(riddleNumber)
	} catch {
		notFound()
	}

	// Get current riddle of the day to determine navigation bounds
	const currentRiddle = await getRiddleOfTheDay()
	const currentNumber = currentRiddle.riddleNumber

	// Determine if there are previous/next riddles
	const hasNext = riddleNumber < currentNumber
	const hasPrevious = riddleNumber > 1

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: riddle.title || `Daily Riddle #${riddleNumber}: ${riddle.riddle?.substring(0, 60) || 'Brain Teaser'}`,
		description: riddle.riddle || '',
		author: {
			'@type': 'Person',
			name: riddle.author || 'Anonymous',
		},
		datePublished: riddle.date ? new Date(Number(riddle.date)).toISOString() : undefined,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://riddonkulous.com/riddle/daily/${riddleNumber}`,
		},
		// Add FAQPage structured data for riddles with answers
		...(riddle.word && {
			mainEntity: {
				'@type': 'FAQPage',
				mainEntity: {
					'@type': 'Question',
					name: riddle.title || `Daily Riddle #${riddleNumber}` || 'Riddle',
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
				<RiddleSingleView
					riddle={riddle}
					hasNext={hasNext}
					hasPrevious={hasPrevious}
					nextUrl={hasNext ? `/riddle/daily/${riddleNumber + 1}` : undefined}
					previousUrl={hasPrevious ? `/riddle/daily/${riddleNumber - 1}` : undefined}
					title={
						<div className="flex items-center gap-2">
							<Image src="/icons/light.png" alt="Light" width={32} height={32} className="w-8 h-8" />#
							{riddle.riddleNumber} Riddle of the Day
						</div>
					}
					showDate={true}
					showRedditButton={true}
					// showRedditButton={true}
					showShareButton={true}
				/>
			</div>
		</>
	)
}
