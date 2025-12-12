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

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8 gap-8 md:gap-18">
			<div className="w-full flex flex-col lg:flex-row lg:items-start gap-6">
				{/* Main Content - 2/3 width */}
				<div className="flex flex-col gap-4 lg:w-2/3">
					<h1 className="text-2xl md:text-4xl lg:h-12 flex items-center gap-2">
						<Image src="/icons/light.png" alt="Light" width={32} height={32} className="w-8 h-8" />#
						{riddleOfTheDay.riddleNumber} Riddle of the Day
					</h1>

					<RiddleCard riddle={riddleOfTheDay} className="lg:h-[384px]" />
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
								href={`/tags/${tag.id}`}
							/>
						))}
				</div>
			</div>

			{/* About Section */}
			<div className="w-full flex flex-col gap-4">
				<div className="flex justify-center">
					<Image
						src="/pals/frog_magician.gif"
						alt="Frog Magician"
						width={200}
						height={200}
						className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
					/>
				</div>
				<h2 className="text-2xl md:text-3xl mt-12 text-center">Where Am I?</h2>
				<div className="flex flex-col gap-3 text-base md:text-lg">
					<p className="text-center">
						Riddonkulous is a Reddit App for Creating and Solving Riddles. Our goal is to embrace Creativity
						and make it available to everyone.
					</p>
					<p className="text-center">
						riddonkulous.com extends this beyond the Reddit App. Welcome to Riddonkulous!
					</p>
					<div className="flex justify-center mt-4">
						<LinkAsButton
							href="https://www.reddit.com/r/riddonkulous/"
							text="Visit r/riddonkulous"
							target="_blank"
							rel="noopener noreferrer"
							className="text-lg md:text-xl px-4 py-2 block md:inline-block w-full md:w-auto text-center"
						/>
					</div>
				</div>
			</div>

			{/*<div className="w-full flex justify-center items-center">
				<div
					className="w-full"
					style={{
						minWidth: '120px',
						maxWidth: 'min(100%, 1200px)',
						minHeight: '75px',
					}}
				>
					<GoogleAdDisplayUnitResponsive />
				</div>
			</div>*/}
		</div>
	)
}
