import { GoogleAdDisplayUnitResponsive } from '@/app/components/ads/GoogleAdUnitResponsive'
import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { CategoryCard } from '@/app/components/categories/CategoryCard'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { getRiddleOfTheDay, getTrendingRiddles } from '@/app/services/riddleService'
import Image from 'next/image'

export default async function Home() {
	const [riddleOfTheDay, trendingRiddles] = await Promise.all([getRiddleOfTheDay(), getTrendingRiddles()])
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

					<LinkAsButton
						href={`https://www.reddit.com/r/riddonkulous/comments/${riddleOfTheDay.postId}`}
						target="_blank"
						rel="noopener noreferrer"
						className="w-full text-center py-2"
					>
						Visit on Reddit
					</LinkAsButton>
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
							<RiddleCard riddle={riddle} variant="compact" key={riddle.riddleNumber} />
						))}
					</div>
				</div>
			</div>

			{/* Explore Riddles Section */}
			<div className="w-full flex flex-col gap-4">
				<h2 className="text-2xl md:text-3xl">Explore Riddles</h2>
				<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
					<CategoryCard
						title="Classic"
						riddleCount={10}
						description="Serious, warm, classic riddles, you get what you expect"
						backgroundImage="/canvas/BG029.gif"
					/>
					<CategoryCard
						title="Fun"
						riddleCount={42}
						description="Absolutely ridiculous riddles that are fun, have a lot of wordplay and so on"
						backgroundImage="/canvas/BG021.png"
					/>
					<CategoryCard
						title="Family"
						riddleCount={222}
						description="Suitable for kids and family"
						backgroundImage="/canvas/BG023.png"
					/>
				</div>
			</div>

			<div className="w-full flex justify-center items-center">
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
			</div>
		</div>
	)
}
