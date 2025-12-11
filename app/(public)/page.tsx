import { GoogleAdDisplayUnitResponsive } from '@/app/components/ads/GoogleAdUnitResponsive'
import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { getRiddleOfTheDay } from '@/app/services/riddleService'
import { formatDate } from '@/app/util/format'

import Link from 'next/link'

export default async function Home() {
	const riddleOfTheDay = await getRiddleOfTheDay()
	console.log(riddleOfTheDay)

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8 gap-4">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl md:text-4xl">#{riddleOfTheDay.riddleNumber} Riddle of the Day</h1>
				<p>
					<Link href="https://www.reddit.com/r/riddonkulous/" target="_blank" className="underline">
						r/riddonkulous
					</Link>
					{riddleOfTheDay.date && <span> on {formatDate(riddleOfTheDay.date)}</span>}
				</p>
				<RiddleCard riddle={riddleOfTheDay} />

				<LinkAsButton
					href={`https://www.reddit.com/r/riddonkulous/comments/${riddleOfTheDay.postId}`}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full text-center py-2"
				>
					Visit on Reddit
				</LinkAsButton>
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
