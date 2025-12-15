import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { getRiddleByNumber, getRiddleOfTheDay } from '@/app/services/riddleService'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'

interface DailyRiddlePageProps {
	params: Promise<{
		number: string
	}>
}

export const revalidate = 3600 // 1 hour

export const generateMetadata = async ({ params }: DailyRiddlePageProps): Promise<Metadata> => {
	const { number } = await params
	const riddleNumber = parseInt(number, 10)

	if (isNaN(riddleNumber) || riddleNumber < 1) {
		return {
			title: 'Daily Riddle | Riddonkulous',
			description: 'Solve daily riddles on Riddonkulous!',
		}
	}

	try {
		const riddle = await getRiddleByNumber()
		const title = riddle.title || riddle.riddle?.substring(0, 60) || `Daily Riddle #${riddleNumber}`
		const description = riddle.title
			? `Solve this riddle: ${riddle.riddle?.substring(0, 150) || ''}`
			: `Challenge yourself with Daily Riddle #${riddleNumber} on Riddonkulous!`

		const url = `https://riddonkulous.com/riddle/daily/${riddleNumber}`

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
	} catch {
		return {
			title: 'Daily Riddle | Riddonkulous',
			description: 'Solve daily riddles on Riddonkulous!',
		}
	}
}

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

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8">
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
				showShareButton={true}
			/>
		</div>
	)
}
