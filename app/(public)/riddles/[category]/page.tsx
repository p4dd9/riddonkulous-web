import { GoogleAdDisplayUnitHorizontal } from '@/app/components/ads/GoogleAdDisplayUnitHorizontal'
import { GoogleAdInFeedUnit } from '@/app/components/ads/GoogleAdInFeedUnit'
import { GoogleAdMobileBanner } from '@/app/components/ads/GoogleAdMobileBanner'
import { GoogleAdVerticalFixed } from '@/app/components/ads/GoogleAdVerticalFixed'
import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { getRiddlesByTag } from '@/app/services/riddleService'
import { stripSolutions } from '@/app/util/stripSolution'
import { getTagById, listTags } from '@/app/services/tagService'
import { formatDate } from '@/app/util/format'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

interface RiddlesCategoryPageProps {
	params: Promise<{
		category: string
	}>
	searchParams: Promise<{
		page?: string
	}>
}

const RIDDLES_PER_PAGE = 5

export const generateMetadata = async ({ params, searchParams }: RiddlesCategoryPageProps): Promise<Metadata> => {
	const { category } = await params
	const { page } = await searchParams
	const currentPage = page ? parseInt(page, 10) : 0

	const [tag, riddlesResponse] = await Promise.all([
		getTagById(category),
		getRiddlesByTag(category, 1, currentPage * RIDDLES_PER_PAGE),
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

export const revalidate = 3600 // Cache for 1 hour

export default async function RiddlesCategoryPage({ params, searchParams }: RiddlesCategoryPageProps) {
	const { category } = await params
	const { page } = await searchParams

	const currentPage = page ? parseInt(page, 10) : 0

	if (isNaN(currentPage) || currentPage < 0) {
		redirect(`/riddles/${category}?page=0`)
	}

	const [tag, riddlesResponse, allTags] = await Promise.all([
		getTagById(category),
		getRiddlesByTag(category, RIDDLES_PER_PAGE, currentPage * RIDDLES_PER_PAGE),
		listTags(50, 0),
	])

	if (!tag || !riddlesResponse || riddlesResponse.riddles.length === 0) {
		notFound()
	}

	const riddles = stripSolutions(riddlesResponse.riddles)
	const hasNext = riddlesResponse.pagination.hasNext
	const hasPrevious = riddlesResponse.pagination.hasPrev

	// Get 3 randomly selected categories (excluding current one)
	const filteredTags = allTags.tags.filter((t) => t.id !== category)
	// Use category ID as seed for deterministic but pseudo-random selection
	const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
	const shuffled = [...filteredTags].sort((a, b) => {
		const hashA = (a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 1000
		const hashB = (b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 1000
		return hashA - hashB
	})
	const otherCategories = shuffled.slice(0, 3)

	// Generate category description if not available (shortened by 50%)
	const getCategoryDescription = (tagLabel: string, tagDescription?: string): string => {
		if (tagDescription && tagDescription.length >= 100) {
			// Shorten existing description by 50%
			return tagDescription.substring(0, Math.floor(tagDescription.length / 2))
		}

		// Generate shortened descriptions for common categories (50% of original)
		const descriptions: Record<string, string> = {
			Logic: `Logic riddles challenge your ability to think systematically and solve problems through reasoning. These puzzles require you to analyze information, identify patterns, and draw logical conclusions. Logic riddles often involve sequences, relationships, and deductive reasoning, making them excellent exercises for developing critical thinking skills.`,
			Wordplay: `Wordplay riddles are all about the clever use of language, puns, double meanings, and linguistic tricks. These riddles exploit the multiple meanings of words, homophones, and the playful nature of language itself. Solving wordplay riddles requires a deep understanding of vocabulary, context, and the subtle nuances of how words can be interpreted.`,
			Math: `Mathematical riddles combine numerical reasoning with creative problem-solving. These puzzles challenge you to apply mathematical concepts, recognize patterns, and perform calculations to find solutions. Math riddles can range from simple arithmetic to complex algebraic thinking, making them accessible to various skill levels.`,
			Lateral: `Lateral thinking riddles require you to approach problems from unconventional angles and think outside the box. These puzzles challenge traditional linear thinking and encourage creative, non-obvious solutions. Lateral thinking riddles often have answers that seem surprising or counterintuitive at first, but make perfect sense once you shift your perspective.`,
			Science: `Science riddles explore concepts from physics, chemistry, biology, and other scientific disciplines through engaging puzzles. These riddles challenge you to apply scientific knowledge and reasoning to solve problems. They make complex scientific concepts accessible and fun, helping to develop scientific literacy and curiosity about the natural world.`,
			History: `History riddles connect you with the past through puzzles that reference historical events, figures, and periods. These riddles challenge you to draw on historical knowledge while solving engaging puzzles. They make history interactive and memorable, helping to develop historical literacy and cultural awareness.`,
		}

		const normalizedLabel = tagLabel.toLowerCase()
		for (const [key, description] of Object.entries(descriptions)) {
			if (normalizedLabel.includes(key.toLowerCase())) {
				return description
			}
		}

		// Generic fallback description (shortened)
		return `${tagLabel} riddles offer a unique challenge that combines creativity, logic, and problem-solving skills. These puzzles are designed to engage your mind, encourage lateral thinking, and provide an entertaining way to exercise your cognitive abilities. Whether you're a seasoned riddle solver or just starting out, ${tagLabel.toLowerCase()} riddles provide an excellent opportunity to test your skills and discover new ways of thinking.`
	}

	const categoryDescription = getCategoryDescription(tag.label, tag.description)

	return (
		<>
			<GoogleAdVerticalFixed />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8 gap-6">
				<GoogleAdMobileBanner customClasses="mt-[-32px] mb-2" />
				<GoogleAdDisplayUnitHorizontal />
			<div className="w-full max-w-4xl flex flex-col gap-4">
				<h1 className="text-3xl md:text-4xl text-center mb-2">{tag.label} Riddles</h1>
			</div>
			{/* Category Description Section - At the top */}
			<div className="w-full max-w-4xl flex flex-col gap-4">
				<div className="prose prose-invert max-w-none">
					<p className="text-white/80 text-base md:text-lg leading-relaxed">{categoryDescription}</p>
				</div>
			</div>
			{/* Riddles List */}
			<div className="w-full max-w-4xl flex flex-col gap-4">
				{riddles.map((riddle, index) => {
					const isWebCreated = riddle.postId.startsWith('r_')
					const showAd = (index + 1) % 4 === 0
					return (
						<>
							<div key={riddle.postId} className="w-full flex flex-col gap-3">
								{isWebCreated && riddle.author ? (
									<div className="flex items-center justify-start px-2">
										<p className="text-sm opacity-90">{formatDate(riddle.date)}</p>
									</div>
								) : (
									<div className="flex items-center justify-start px-2">
										<p className="text-sm opacity-90">{formatDate(riddle.date)}</p>
									</div>
								)}
								<RiddleCard
									riddle={riddle}
									className="w-full"
									textClassName="line-clamp-5"
									solveHref={`/riddle/${riddle.postId}`}
								/>
							</div>
							{showAd && <GoogleAdInFeedUnit customClasses="my-4" />}
						</>
					)
				})}
			</div>
			{/* Navigation Buttons */}
			{(hasNext || hasPrevious) && (
				<div className="w-full flex justify-between gap-4 max-w-4xl">
					<LinkAsButton
						href={hasPrevious ? `/riddles/${category}?page=${currentPage - 1}` : '#'}
						text="Back"
						customClass="px-4 py-2 md:px-8 md:py-4 md:min-w-[120px]"
						disabled={!hasPrevious}
					/>
					<LinkAsButton
						href={hasNext ? `/riddles/${category}?page=${currentPage + 1}` : '#'}
						text="Next"
						customClass="flex px-4 py-2 md:px-8 md:py-4 md:min-w-[120px] justify-center"
						disabled={!hasNext}
					/>
				</div>
			)}
			{/* Other Riddles You Might Like Section */}
			{otherCategories.length > 0 && (
				<div className="w-full max-w-4xl flex flex-col gap-4 mt-8">
					<h2 className="text-2xl md:text-3xl">Other Riddles You Might Like</h2>
					<ul className="w-full flex flex-col gap-2">
						{otherCategories.map((otherTag) => (
							<li key={otherTag.id}>
								<Link
									href={`/riddles/${otherTag.id}`}
									className="flex items-center justify-between py-2 rounded-md hover:bg-gray-800 transition-colors"
								>
									<span className="text-white">{otherTag.label}</span>
									{otherTag.count !== undefined && (
										<span className="text-sm text-white/60">{otherTag.count} riddles</span>
									)}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
			</div>
		</>
	)
}
