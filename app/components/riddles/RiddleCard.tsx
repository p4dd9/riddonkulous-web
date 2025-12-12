'use client'

import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import { getCanvasBackground } from '@/app/util/cosmetics'
import Image from 'next/image'
import { LinkAsButton } from '../buttons/LinkAsButton'

interface RiddleCardProps {
	riddle: DailyRiddleType
	className?: string
	variant?: 'default' | 'compact'
	hideSolveButton?: boolean
}

export const RiddleCard = ({
	riddle,
	className = '',
	variant = 'default',
	hideSolveButton = false,
}: RiddleCardProps) => {
	const isCompact = variant === 'compact'

	return (
		<div
			className={`relative py-1 px-2 rounded-lg ${
				isCompact ? 'h-[120px]' : ''
			} w-full flex flex-col items-stretch overflow-hidden border-2 ${className}`}
		>
			<div
				className="absolute inset-0 bg-position-[center_bottom] bg-no-repeat bg-cover rounded-lg"
				style={{
					backgroundImage: `url(${getCanvasBackground(riddle.bg || 'bg1.png')})`,
					filter: 'brightness(0.6)',
				}}
			/>

			<div
				className={`relative z-10 flex flex-col items-center justify-between w-full ${isCompact ? 'h-full' : 'flex-1'}`}
			>
				<div className={`flex items-center w-full ${isCompact ? 'justify-end' : 'justify-between'} gap-4`}>
					{!isCompact && (
						<div className="flex items-center justify-center gap-2">
							<Image src="/icons/eye.png" alt="Eye" width={28} height={28} className="w-7 h-7" />{' '}
							{riddle.guessCount}
						</div>
					)}
					<div className="flex items-center justify-center gap-2">
						<Image
							src="/icons/star.png"
							alt="Star"
							width={isCompact ? 16 : 28}
							height={isCompact ? 16 : 28}
							className={isCompact ? 'w-4 h-4' : 'w-7 h-7'}
						/>{' '}
						<span className={isCompact ? 'text-xs' : ''}>{riddle.popularity}</span>
					</div>
				</div>
				<div
					className={`relative ${
						isCompact
							? 'text-sm w-full text-center flex-1 flex items-center justify-center py-2 px-1'
							: 'text-xl w-[95%] md:w-[80%] lg:w-[70%] text-center flex-1 flex items-center justify-center py-4'
					}`}
				>
					<p className={isCompact ? 'line-clamp-2' : ''}>{riddle.riddle}</p>
				</div>
				{!hideSolveButton && (
					<div className={`flex items-center w-full pb-2 ${isCompact ? 'justify-end' : 'justify-center'}`}>
						<LinkAsButton
							href={`/riddle/${riddle.postId}`}
							text="Solve"
							textAlign="center"
							customClass={
								isCompact
									? 'bg-primary hover:bg-primary px-1.5 py-0.5 rounded-md text-white text-xs transition-colors'
									: 'px-4 py-1'
							}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
