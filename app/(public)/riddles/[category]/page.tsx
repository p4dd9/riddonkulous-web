import { RiddleSingleView } from '@/app/components/riddles/RiddleSingleView'
import { getRiddlesByTag } from '@/app/services/riddleService'
import { getTagById } from '@/app/services/tagService'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

interface RiddlesCategoryPageProps {
	params: Promise<{
		category: string
	}>
	searchParams: Promise<{
		page?: string
	}>
}

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
			description: 'Browse riddles by category. All riddles come with answers.',
		}
	}

	const pageSuffix = currentPage > 0 ? ` - Page ${currentPage + 1}` : ''
	const title = `${tag.label} Riddles with Answers${pageSuffix}`
	const description =
		tag.description ||
		`${tag.label} riddles with answers. Brain teasers, logic puzzles, and tricky riddles. See if you can solve them.`

	const url = `https://riddonkulous.com/riddles/${category}${currentPage > 0 ? `?page=${currentPage}` : ''}`

	return {
		title,
		description,
		openGraph: {
			title: `${tag.label} Riddles with Answers`,
			description: `${tag.label} riddles with answers. Brain teasers, logic puzzles, and tricky riddles. Can you crack them?`,
			type: 'website',
			url,
			images: [
				{
					url: '/web-app-manifest-512x512.png',
					width: 512,
					height: 512,
					alt: `${tag.label} riddles`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${tag.label} Riddles with Answers`,
			description: `${tag.label} riddles with answers. Brain teasers, logic puzzles, and tricky riddles. Can you crack them?`,
			images: ['/web-app-manifest-512x512.png'],
		},
		alternates: {
			canonical: url,
		},
	}
}

export default async function RiddlesCategoryPage({ params, searchParams }: RiddlesCategoryPageProps) {
	'use cache'
	cacheLife('hours') // Cache for 1 hour

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

	if (!tag || !riddlesResponse || riddlesResponse.riddles.length === 0) {
		notFound()
	}

	const currentRiddle = riddlesResponse.riddles[0]
	const hasNext = riddlesResponse.pagination.hasNext
	const hasPrevious = riddlesResponse.pagination.hasPrev

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8">
			<RiddleSingleView
				riddle={currentRiddle}
				hasNext={hasNext}
				hasPrevious={hasPrevious}
				nextUrl={hasNext ? `/riddles/${category}?page=${currentPage + 1}` : undefined}
				previousUrl={hasPrevious ? `/riddles/${category}?page=${currentPage - 1}` : undefined}
				title={tag.label}
				showDate={true}
				showRedditButton={true}
				showShareButton={true}
			/>
		</div>
	)
}
