import { GoogleAdDisplayUnitResponsive } from '@/app/components/ads/GoogleAdUnitResponsive'
import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { getRiddleOfTheDay } from '@/app/services/riddleService'
import { getCanvasBackground } from '@/app/util/cosmetics'
import { formatDate } from '@/app/util/format'

import Image from 'next/image'
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
				<div className="relative py-4 px-2 rounded-lg min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] w-full flex flex-col items-stretch overflow-hidden border-2">
					<div
						className="absolute inset-0 bg-position-[center_bottom] bg-no-repeat bg-cover rounded-lg"
						style={{
							backgroundImage: `url(${getCanvasBackground(riddleOfTheDay.bg || 'bg1.png')})`,
							filter: 'brightness(0.6)',
						}}
					/>

					<div className="relative z-10 flex flex-col items-center justify-between w-full py-2 flex-1 min-h-full">
						<div></div>
						<div className="relative text-xl md:text-2xl w-[95%] md:w-[80%] lg:w-[70%] text-center flex-1 flex items-center justify-center py-4">
							<p>{riddleOfTheDay.riddle}</p>
						</div>

						<div className="flex items-center w-full gap-4 justify-between">
							<div className="flex items-center justify-center gap-2">
								<Image src="/icons/eye.png" alt="Eye" width={40} height={40} className="w-10 h-10" />{' '}
								{riddleOfTheDay.guessCount}
							</div>
							<div className="flex items-center justify-center gap-2">
								<Image src="/icons/star.png" alt="Star" width={40} height={40} className="w-10 h-10" />{' '}
								{riddleOfTheDay.popularity}
							</div>
						</div>
					</div>
				</div>

				<LinkAsButton
					href={`https://www.reddit.com/r/riddonkulous/comments/${riddleOfTheDay.postId}`}
					target="_blank"
					rel="noopener noreferrer"
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
					}}
				>
					<GoogleAdDisplayUnitResponsive />
				</div>
			</div>
		</div>
	)
}
