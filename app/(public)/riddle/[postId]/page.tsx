import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { getRiddleByPostId } from '@/app/services/riddleService'
import type { Metadata } from 'next'

interface RiddlePageProps {
	params: Promise<{
		postId: string
	}>
}

export const revalidate = 3600 // 1 hour

export const generateMetadata = async ({ params }: RiddlePageProps): Promise<Metadata> => {
	const { postId } = await params
	const riddle = await getRiddleByPostId(postId)

	const title = riddle.title || riddle.riddle?.substring(0, 60) || 'Riddle'
	const description = riddle.title
		? `Solve this riddle: ${riddle.riddle?.substring(0, 150) || ''}`
		: riddle.riddle?.substring(0, 150) || 'Challenge yourself with this riddle on Riddonkulous!'

	return {
		title: `${title} | Riddonkulous`,
		description,
		openGraph: {
			title: `${title} | Riddonkulous`,
			description,
			type: 'website',
		},
		twitter: {
			card: 'summary',
			title: `${title} | Riddonkulous`,
			description,
		},
	}
}

export default async function RiddlePage({ params }: RiddlePageProps) {
	const { postId } = await params

	const riddle = await getRiddleByPostId(postId)

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<RiddleSingleView riddle={riddle} />
		</div>
	)
}
