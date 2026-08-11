import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { CategoryCard } from '@/app/components/categories/CategoryCard'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { StructuredData } from '@/app/components/seo/StructuredData'
import { getRiddleOfTheDay, getTrendingRiddles } from '@/app/services/riddleService'
import { listTags } from '@/app/services/tagService'
import { stripSolution, stripSolutions } from '@/app/util/stripSolution'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { GoogleAdCategoryGrid } from '../components/ads/GoogleAdCategoryGrid'
import { GoogleAdMobileBanner } from '../components/ads/GoogleAdMobileBanner'
import { GoogleAdVerticalFixed } from '../components/ads/GoogleAdVerticalFixed'

export const metadata: Metadata = {
	title: 'Daily Riddles | Riddles with Answers',
	description:
		'New riddle every day, with answers. Brain teasers, logic puzzles, and tricky riddles that make you think sideways. No corporate nonsense, just good riddles.',
	openGraph: {
		title: 'Daily Riddles | Riddles with Answers',
		description:
			'New riddle every day, with answers. Brain teasers, logic puzzles, and tricky riddles. Can you solve them?',
		url: 'https://riddonkulous.com',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Daily Riddles | Riddles with Answers',
		description:
			'New riddle every day, with answers. Brain teasers, logic puzzles, and tricky riddles. Can you solve them?',
	},
	alternates: {
		canonical: 'https://riddonkulous.com',
	},
}

export const revalidate = 60 // Cache for 60 seconds

const sortTags = (tags: Awaited<ReturnType<typeof listTags>>['tags']) =>
	[...tags].sort((a, b) => {
		const orderA = a.order ?? Number.MAX_SAFE_INTEGER
		const orderB = b.order ?? Number.MAX_SAFE_INTEGER

		if (orderA !== orderB) {
			return orderA - orderB
		}

		return a.label.localeCompare(b.label)
	})

const formatRiddleDate = (date: Date | string) => {
	const parsed = typeof date === 'string' ? new Date(date) : date
	if (Number.isNaN(parsed.getTime())) return ''

	return parsed.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	})
}

const playPaths = [
	{
		href: '/riddle/adventure',
		icon: '/icons/item.png',
		iconClassName: 'animate-gentle-float',
		title: 'Daily Adventure',
		description: '7 riddles in a row — your daily streak challenge',
	},
] as const

const playPathLinkClassName = (stretch = false) =>
	`group flex items-center gap-4 p-4 rounded-lg border-2 border-primary/30 hover:border-primary active:scale-[0.985] transition-all duration-200${
		stretch ? ' flex-1 min-h-0' : ''
	}`

export default async function Home() {
	const [riddleOfTheDay, trendingRiddles, tagsData] = await Promise.all([
		getRiddleOfTheDay(),
		getTrendingRiddles(),
		listTags(20, 0),
	])
	const safeRiddleOfTheDay = stripSolution(riddleOfTheDay)
	const dailySolveHref = `/riddle/daily/${riddleOfTheDay.riddleNumber}`
	const riddleDateLabel = formatRiddleDate(riddleOfTheDay.featuredDate)
	const popularTags = sortTags(tagsData.tags).slice(0, 6)
	const filteredTrendingRiddles = stripSolutions(
		trendingRiddles.filter((riddle) => riddle.postId !== riddleOfTheDay.postId).slice(0, 3)
	)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Riddonkulous',
		description: 'A platform for creating and solving riddles',
		url: 'https://riddonkulous.com',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: 'https://riddonkulous.com/riddles/{search_term_string}',
			},
			'query-input': 'required name=search_term_string',
		},
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Daily Riddles',
					url: 'https://riddonkulous.com',
				},
				...popularTags.map((tag, index) => ({
					'@type': 'ListItem' as const,
					position: index + 2,
					name: `${tag.label} Riddles`,
					url: `https://riddonkulous.com/riddles/${tag.id}`,
				})),
			],
		},
	}

	return (
		<>
			<StructuredData data={structuredData} />
			<GoogleAdVerticalFixed />
			<div className="relative h-full min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-6 md:py-10 gap-10 md:gap-14">
				<div className="w-full flex flex-col gap-5 md:gap-7">
					<section className="w-full flex flex-col gap-5">
						<div className="flex items-start gap-3 md:gap-5">
							<Image
								src="/pals/frog_magician.gif"
								alt=""
								width={112}
								height={112}
								className="hidden md:block w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0"
								aria-hidden
								unoptimized
							/>
							<div className="flex flex-col gap-2 min-w-0 flex-1">
								<p className="text-sm md:text-base text-primary/90">
									Riddle #{riddleOfTheDay.riddleNumber} · {riddleDateLabel}
								</p>
								<h1 className="text-2xl md:text-4xl flex items-center gap-2">
									<Image
										src="/icons/light.png"
										alt=""
										width={32}
										height={32}
										className="w-7 h-7 md:w-8 md:h-8"
									/>
									Riddle of The Day
								</h1>
								<p className="text-sm md:text-lg opacity-80 max-w-xl">
									A fresh brain teaser every day. Tap the card below to guess — a new puzzle drops daily.
								</p>
							</div>
						</div>

						<div className="w-full flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_min(100%,22rem)] lg:gap-x-6 lg:gap-y-3">
							<div className="hidden lg:block lg:col-start-2">
								<h2 className="text-lg md:text-xl opacity-80">More ways to play</h2>
							</div>

							<RiddleCard
								riddle={safeRiddleOfTheDay}
								className="min-h-[260px] md:min-h-[300px] lg:col-start-1 lg:row-start-2 lg:min-w-0"
								solveHref={dailySolveHref}
								textClassName="line-clamp-6 md:line-clamp-7"
							/>

							{/* More ways to play — desktop sidebar, height matches riddle card only */}
							<aside className="hidden lg:flex lg:col-start-2 lg:row-start-2 flex-col gap-3 shrink-0 min-h-0">
								<div className="flex flex-col gap-3 flex-1 min-h-0 h-full">
									{playPaths.map((path) => (
										<Link key={path.href} href={path.href} className={playPathLinkClassName(true)}>
											<Image
												src={path.icon}
												alt=""
												width={40}
												height={40}
												className={`w-10 h-10 shrink-0 ${path.iconClassName}`}
												aria-hidden
											/>
											<div className="flex flex-col gap-0.5 min-w-0">
												<span className="text-lg md:text-xl">{path.title}</span>
												<span className="text-sm opacity-75">{path.description}</span>
											</div>
											<Image
												src="/icons/arrow_right.png"
												alt=""
												width={16}
												height={16}
												className="ml-auto w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
												aria-hidden
											/>
										</Link>
									))}
								</div>
							</aside>
						</div>
					</section>

					<GoogleAdMobileBanner />

					{/* More ways to play — mobile & tablet */}
					<section className="w-full flex flex-col gap-3 lg:hidden">
						<h2 className="text-lg md:text-xl opacity-80">More ways to play</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{playPaths.map((path) => (
								<Link key={path.href} href={path.href} className={playPathLinkClassName()}>
									<Image
										src={path.icon}
										alt=""
										width={40}
										height={40}
										className={`w-10 h-10 shrink-0 ${path.iconClassName}`}
										aria-hidden
									/>
									<div className="flex flex-col gap-0.5 min-w-0">
										<span className="text-lg md:text-xl">{path.title}</span>
										<span className="text-sm opacity-75">{path.description}</span>
									</div>
									<Image
										src="/icons/arrow_right.png"
										alt=""
										width={16}
										height={16}
										className="ml-auto w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
										aria-hidden
									/>
								</Link>
							))}
						</div>
					</section>
				</div>

				{/* Trending — lighter section */}
				{filteredTrendingRiddles.length > 0 && (
					<section className="w-full flex flex-col gap-4">
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-xl md:text-2xl flex items-center gap-2">
								<Image
									src="/icons/script_lightning.png"
									alt=""
									width={24}
									height={24}
									className="w-6 h-6"
									aria-hidden
								/>
								Trending now
							</h2>
						</div>
						<div className="flex flex-col lg:flex-row gap-3">
							{filteredTrendingRiddles.map((riddle) => (
								<RiddleCard
									riddle={riddle}
									variant="compact"
									key={riddle.postId}
									className="lg:flex-1"
									hideBackground={true}
								/>
							))}
						</div>
					</section>
				)}

				{/* Popular categories — curated slice, not the full catalog */}
				<section className="w-full flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<h2 className="text-xl md:text-2xl">Popular categories</h2>
						<p className="text-sm md:text-base opacity-75">Open the menu for every topic</p>
					</div>
					<div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
						{popularTags.map((tag) => (
							<CategoryCard
								key={tag.id}
								title={tag.label}
								riddleCount={tag.count || 0}
								description={tag.description || ''}
								backgroundImage={tag.asset_name_path}
								href={`/riddles/${tag.id}`}
							/>
						))}
						<GoogleAdCategoryGrid />
					</div>
				</section>

				{/* About Riddles Section */}
				<div id="about-riddles" className="w-full flex flex-col gap-4">
					<h2 className="text-2xl md:text-3xl text-center">About Riddles</h2>
					<div className="text-center mb-4">
						<p className="text-lg md:text-xl opacity-90">Riddles and how to use them</p>
					</div>
					<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center">
							<Image
								src="/icons/book.png"
								alt="Book"
								width={56}
								height={56}
								className="w-14 h-14 md:w-16 md:h-16 mb-4"
							/>
							<h3 className="text-xl md:text-2xl mb-3 text-center">Riddles in History</h3>
							<p className="text-sm md:text-base text-center opacity-90 mb-4">
								Discover how riddles have shaped cultures and civilizations throughout human history,
								from ancient mythology to modern literature.
							</p>
							<LinkAsButton
								href="/riddles-in-history"
								text="Read More"
								textAlign="center"
								customClass="px-8 py-1"
							/>
						</div>
						<div className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center">
							<Image
								src="/icons/wizard.png"
								alt="Wizard"
								width={56}
								height={56}
								className="w-14 h-14 md:w-16 md:h-16 mb-4"
							/>
							<h3 className="text-xl md:text-2xl mb-3 text-center">Using Riddles</h3>
							<p className="text-sm md:text-base text-center opacity-90 mb-4">
								Learn practical ways to incorporate riddles into education, entertainment, and cognitive
								development.
							</p>
							<LinkAsButton
								href="/using-riddles"
								text="Read More"
								textAlign="center"
								customClass="px-8 py-1"
							/>
						</div>
						<div className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center">
							<Image
								src="/icons/pencil.png"
								alt="Pencil"
								width={56}
								height={56}
								className="w-14 h-14 md:w-16 md:h-16 mb-4"
							/>
							<h3 className="text-xl md:text-2xl mb-3 text-center">Writing Riddles</h3>
							<p className="text-sm md:text-base text-center opacity-90 mb-4">
								Learn the art and craft of creating engaging riddles, from understanding structure to
								mastering wordplay and creative expression.
							</p>
							<LinkAsButton
								href="/writing-riddles"
								text="Read More"
								textAlign="center"
								customClass="px-8 py-1"
							/>
						</div>
						<div className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center">
							<Image
								src="/icons/window_dialogue.png"
								alt="Window Dialogue"
								width={56}
								height={56}
								className="w-14 h-14 md:w-16 md:h-16 mb-4"
							/>
							<h3 className="text-xl md:text-2xl mb-3 text-center">Developer Interview</h3>
							<p className="text-sm md:text-base text-center opacity-90 mb-4">
								Learn about the story behind Riddonkulous, how it was built on Reddit&apos;s Developer
								Platform, and where we are now.
							</p>
							<LinkAsButton
								href="https://developers.reddit.com/docs/blog/riddonkulous"
								text="Read More"
								textAlign="center"
								customClass="px-8 py-1"
								target="_blank"
								rel="noopener noreferrer"
							/>
						</div>
						<div className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center">
							<Image
								src="/icons/party.png"
								alt="Party"
								width={56}
								height={56}
								className="w-14 h-14 md:w-16 md:h-16 mb-4"
							/>
							<h3 className="text-xl md:text-2xl mb-3 text-center">Community Interview</h3>
							<p className="text-sm md:text-base text-center opacity-90 mb-4">
								Get to know one of the most active members of our community, what they love about
								riddles and what makes a great riddle.
							</p>
							<LinkAsButton
								href="/community-interview"
								text="Read More"
								textAlign="center"
								customClass="px-8 py-1"
							/>
						</div>
						<div className="relative py-6 px-4 rounded-lg w-full flex flex-col items-center justify-center">
							<Image
								src="/icons/help.png"
								alt="Help"
								width={56}
								height={56}
								className="w-14 h-14 md:w-16 md:h-16 mb-4"
							/>
							<h3 className="text-xl md:text-2xl mb-3 text-center">FAQ</h3>
							<p className="text-sm md:text-base text-center opacity-90 mb-4">
								Find answers to frequently asked questions about Riddonkulous, how to use the platform,
								and more.
							</p>
							<LinkAsButton href="/faq" text="Read More" textAlign="center" customClass="px-8 py-1" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
