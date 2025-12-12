import { RedditLinkButton } from '@/app/components/buttons/RedditLinkButton'
import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { ShareButton } from '@/app/components/ShareButton'
import { getRiddlesByTag } from '@/app/services/riddleService'
import { getTagById } from '@/app/services/tagService'
import { formatDate } from '@/app/util/format'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

interface RiddlesCategoryPageProps {
	params: Promise<{
		category: string
	}>
	searchParams: Promise<{
		page?: string
	}>
}

export const revalidate = 3600 // 1 hour

const RIDDLES_PER_PAGE = 1

export const generateMetadata = async ({ params, searchParams }: RiddlesCategoryPageProps): Promise<Metadata> => {
	const { category } = await params
	const { page } = await searchParams
	const currentPage = page ? parseInt(page, 10) : 0

	const [tag, riddlesResponse] = await Promise.all([
		getTagById(category),
		getRiddlesByTag(category, RIDDLES_PER_PAGE, currentPage * RIDDLES_PER_PAGE),
	])

	if (!tag || !riddlesResponse || riddlesResponse.riddles.length === 0) {
		return {
			title: 'Riddle Category | Riddonkulous',
			description: 'Browse riddles by category on Riddonkulous.',
		}
	}

	const pageSuffix = currentPage > 0 ? ` - Page ${currentPage + 1}` : ''
	const title = `${tag.label} Riddles${pageSuffix} | Riddonkulous`
	const description =
		tag.description ||
		`Explore ${tag.label.toLowerCase()} riddles on Riddonkulous. Challenge yourself with fun and engaging Riddles!`

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
		},
		twitter: {
			card: 'summary',
			title,
			description,
		},
	}
}

export default async function RiddlesCategoryPage({ params, searchParams }: RiddlesCategoryPageProps) {
	const { category } = await params
	const { page } = await searchParams

	const currentPage = page ? parseInt(page, 10) : 0

	if (isNaN(currentPage) || currentPage < 0) {
		redirect(`/riddles/${category}?page=0`)
	}

	const [tag, riddlesResponse] = await Promise.all([
		getTagById(category),
		getRiddlesByTag(category, RIDDLES_PER_PAGE, currentPage * RIDDLES_PER_PAGE),
	])

	console.log(riddlesResponse)

	if (!tag || !riddlesResponse || riddlesResponse.riddles.length === 0) {
		notFound()
	}

	const currentRiddle = riddlesResponse.riddles[0]
	const hasNext = riddlesResponse.pagination.hasNext
	const hasPrevious = riddlesResponse.pagination.hasPrev

	console.log(currentRiddle)
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full flex flex-col gap-4 max-w-4xl mx-auto px-4">
				<h1 className="text-2xl md:text-4xl font-bold">{tag.label}</h1>

				<div>
					<div className="w-full flex items-center justify-between gap-4">
						<p>{formatDate(currentRiddle.date)}</p>
						<div className="flex items-center gap-2">
							{currentRiddle.subreddit && currentRiddle.postId && (
								<RedditLinkButton
									href={`https://www.reddit.com/r/${currentRiddle.subreddit}/comments/${currentRiddle.postId}/`}
								/>
							)}
							<ShareButton title="Share this riddle" />
						</div>
					</div>
				</div>
			</div>

			<RiddleSingleView
				riddle={currentRiddle}
				hasNext={hasNext}
				hasPrevious={hasPrevious}
				nextUrl={hasNext ? `/riddles/${category}?page=${currentPage + 1}` : undefined}
				previousUrl={hasPrevious ? `/riddles/${category}?page=${currentPage - 1}` : undefined}
			/>
		</div>
	)
}
