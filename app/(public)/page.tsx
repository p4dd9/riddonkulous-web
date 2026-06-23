import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { CategoryCard } from '@/app/components/categories/CategoryCard'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { StructuredData } from '@/app/components/seo/StructuredData'
import { getCurrentAdventure, getRiddleOfTheDay, getTrendingRiddles } from '@/app/services/riddleService'
import { listTags } from '@/app/services/tagService'
import { stripSolution, stripSolutions } from '@/app/util/stripSolution'
import type { Metadata } from 'next'
import Image from 'next/image'
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

export default async function Home() {
	const [riddleOfTheDay, trendingRiddles, tagsData, currentAdventureNumber] = await Promise.all([
		getRiddleOfTheDay(),
		getTrendingRiddles(),
		listTags(50, 0),
		getCurrentAdventure(),
	])
	const safeRiddleOfTheDay = stripSolution(riddleOfTheDay)
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
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Riddle Feed',
					url: 'https://riddonkulous.com/riddle-feed',
				},
				...tagsData.tags.slice(0, 10).map((tag, index) => ({
					'@type': 'ListItem' as const,
					position: index + 3,
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
			<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8 gap-8 md:gap-18">
				{/* About Section 
			<div className="w-full flex gap-4 md:gap-8 items-end justify-start">
				<Image
					src="/pals/frog_magician.gif"
					alt="Frog Magician"
					width={64}
					height={64}
					className="w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32 "
				/>
				<div className="flex flex-col gap-3 text-xs md:text-3xl">
					<p className="text-left">
						Riddonkulous is a Platform <br className="hidden md:block" /> for Creating and Solving Riddles.
					</p>
				</div>
			</div>*/}
				<div className="w-full flex flex-col gap-6">
					{/* Top Section: Riddle of the Day and Adventure - Equal Prominence */}
					<div className="w-full flex flex-col lg:flex-row lg:items-start gap-6">
						{/* Riddle of the Day - Left */}
						<div className="flex flex-col gap-4 lg:w-1/2 order-1">
							<h1 className="text-2xl md:text-4xl lg:h-12 flex items-center gap-2">
								<Image src="/icons/light.png" alt="Light" width={32} height={32} className="w-8 h-8" />
								Riddle of the Day
							</h1>

							<RiddleCard
								riddle={safeRiddleOfTheDay}
								className="lg:h-[384px]"
								solveHref={`/riddle/daily/${riddleOfTheDay.riddleNumber}`}
								textClassName="line-clamp-7"
							/>
						</div>

						<div className="order-2 lg:hidden">
							<GoogleAdMobileBanner />
						</div>

						{/* Daily Riddle Adventure - Right, Equal Prominence */}
						<div className="flex flex-col gap-4 lg:w-1/2 order-3 lg:order-2">
							<h2 className="text-2xl md:text-4xl lg:h-12 flex items-center gap-2 flex-wrap">
								<Image
									src="/icons/item.png"
									alt="Adventure"
									width={32}
									height={32}
									className="w-8 h-8"
								/>
								<span className="flex items-center gap-2">Daily Adventure</span>
							</h2>
							<div className="relative py-8 px-6 rounded-lg w-full flex flex-col items-center justify-center overflow-hidden min-h-[384px] h-full border-2 border-primary">
								<div
									className="absolute inset-0 bg-position-bottom bg-no-repeat bg-cover rounded-lg"
									style={{
										backgroundImage: 'url(/canvas/BG055.png)',
										filter: 'brightness(0.4)',
									}}
								/>
								<span className="absolute top-2 right-1 px-2 py-1 text-lg bg-primary text-white rounded-full whitespace-nowrap z-20 rotate-12">
									NEW
								</span>
								<div className="relative z-10 flex flex-col items-center justify-center text-center px-4 gap-4">
									<Image
										src="/icons/item.png"
										alt="Adventure"
										width={64}
										height={64}
										className="w-16 h-16"
									/>
									<h3 className="text-2xl md:text-3xl font-bold">Daily Riddle Adventure</h3>
									<p className="text-base md:text-lg opacity-90 max-w-md">
										Solve 7 riddles in sequence. Your daily challenge.
									</p>
									<div className="mt-4">
										<LinkAsButton
											href="/riddle/adventure"
											text="Start Adventure"
											textAlign="center"
											customClass="px-8 py-3 text-lg"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Trending Section - Below Riddle of Day and Adventure */}
					<div className="w-full flex flex-col gap-4">
						<div className="flex items-center justify-between gap-4">
							<h2 className="text-xl md:text-2xl flex items-center gap-2">
								<Image
									src="/icons/script_lightning.png"
									alt="Trending"
									width={24}
									height={24}
									className="w-6 h-6"
								/>
								Trending
							</h2>
							<LinkAsButton
								href="/riddle-feed"
								text="Newest Riddles"
								textAlign="center"
								customClass="text-sm py-1 px-2 rounded-md whitespace-nowrap"
								threeD={true}
								icon="/icons/dialogue.png"
								iconClass="w-4 h-4 shrink-0"
							/>
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
					</div>

					<h2 className="text-2xl md:text-3xl">Explore Riddles</h2>
					<div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
						{tagsData.tags
							.sort((a, b) => {
								const orderA = a.order ?? Number.MAX_SAFE_INTEGER
								const orderB = b.order ?? Number.MAX_SAFE_INTEGER

								if (orderA !== orderB) {
									return orderA - orderB
								}

								return a.label.localeCompare(b.label)
							})
							.map((tag) => (
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
				</div>

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
