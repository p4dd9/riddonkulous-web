import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { CategoryCard } from '@/app/components/categories/CategoryCard'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { getRiddleOfTheDay, getTrendingRiddles } from '@/app/services/riddleService'
import { listTags } from '@/app/services/tagService'
import Image from 'next/image'

// Configure revalidation for this page (ISR - Incremental Static Regeneration)
// The page will be regenerated at most once every 60 seconds
export const revalidate = 60

export default async function Home() {
	const [riddleOfTheDay, trendingRiddles, tagsData] = await Promise.all([
		getRiddleOfTheDay(),
		getTrendingRiddles(),
		listTags(50, 0),
	])
	const filteredTrendingRiddles = trendingRiddles
		.filter((riddle) => riddle.postId !== riddleOfTheDay.postId)
		.slice(0, 3)

	console.log(riddleOfTheDay)

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8 gap-8 md:gap-18">
			{/* About Section */}
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
			</div>
			<div className="w-full flex flex-col lg:flex-row lg:items-start gap-6">
				{/* Main Content - 2/3 width */}
				<div className="flex flex-col gap-4 lg:w-2/3">
					<h1 className="text-2xl md:text-4xl lg:h-12 flex items-center gap-2">
						<Image src="/icons/light.png" alt="Light" width={32} height={32} className="w-8 h-8" />#
						{riddleOfTheDay.riddleNumber} Riddle of the Day
					</h1>

					<RiddleCard
						riddle={riddleOfTheDay}
						className="lg:h-[384px]"
						solveHref={`/riddle/daily/${riddleOfTheDay.riddleNumber}`}
					/>
				</div>

				{/* Trending Sidebar - 1/3 width */}
				<div className="flex flex-col gap-4 lg:w-1/3">
					<h2 className="text-xl md:text-2xl lg:h-12 flex items-center gap-2">
						<Image
							src="/icons/script_lightning.png"
							alt="Trending"
							width={24}
							height={24}
							className="w-6 h-6"
						/>
						Trending
					</h2>
					<div className="flex flex-col gap-3">
						{filteredTrendingRiddles.map((riddle) => (
							<RiddleCard riddle={riddle} variant="compact" key={riddle.postId} />
						))}
					</div>
				</div>
			</div>

			{/* Explore Riddles Section */}
			<div className="w-full flex flex-col gap-4">
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
							Discover how riddles have shaped cultures and civilizations throughout human history, from
							ancient mythology to modern literature.
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
							Get to know one of the most active members of our community, what they love about riddles
							and what makes a great riddle.
						</p>
						<LinkAsButton
							href="/community-interview"
							text="Coming Soon"
							textAlign="center"
							disabled={true}
							customClass="px-8 py-1"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
