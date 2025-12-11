import Image from 'next/image'
import { getCanvasBackground } from '@/app/util/cosmetics'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'

interface RiddleCardProps {
	riddle: DailyRiddleType
	className?: string
}

export const RiddleCard = ({ riddle, className = '' }: RiddleCardProps) => {
	return (
		<div
			className={`relative py-1 px-2 rounded-lg min-h-[50vh] md:min-h-[60vh] w-full flex flex-col items-stretch overflow-hidden border-2 ${className}`}
		>
			<div
				className="absolute inset-0 bg-position-[center_bottom] bg-no-repeat bg-cover rounded-lg"
				style={{
					backgroundImage: `url(${getCanvasBackground(riddle.bg || 'bg1.png')})`,
					filter: 'brightness(0.6)',
				}}
			/>

			<div className="relative z-10 flex flex-col items-center justify-between w-full flex-1 min-h-full">
				<div></div>
				<div className="relative text-xl md:text-2xl w-[95%] md:w-[80%] lg:w-[70%] text-center flex-1 flex items-center justify-center py-4">
					<p>{riddle.riddle}</p>
				</div>

				<div className="flex items-center w-full gap-4 justify-between">
					<div className="flex items-center justify-center gap-2">
						<Image src="/icons/eye.png" alt="Eye" width={28} height={28} className="w-7 h-7" />{' '}
						{riddle.guessCount}
					</div>
					<div className="flex items-center justify-center gap-2">
						<Image src="/icons/star.png" alt="Star" width={28} height={28} className="w-7 h-7" />{' '}
						{riddle.popularity}
					</div>
				</div>
			</div>
		</div>
	)
}

