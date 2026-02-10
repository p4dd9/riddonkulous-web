'use client'

import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import { getCanvasBackground } from '@/app/util/cosmetics'
import { formatPopularity } from '@/app/util/format'
import Image from 'next/image'
import Link from 'next/link'
import { LinkAsButton } from '../buttons/LinkAsButton'

interface RiddleCardProps {
	riddle: DailyRiddleType
	className?: string
	variant?: 'default' | 'compact'
	hideSolveButton?: boolean
	solveHref?: string
	textClassName?: string
	hideStats?: boolean
	extraTopPadding?: boolean
	hideBackground?: boolean
}

export const RiddleCard = ({
	riddle,
	className = '',
	variant = 'default',
	hideSolveButton = false,
	solveHref,
	textClassName,
	hideStats = false,
	extraTopPadding = false,
	hideBackground = false,
}: RiddleCardProps) => {
	const isCompact = variant === 'compact'

	return (
		<div
			className={`relative ${isCompact ? 'py-2' : extraTopPadding ? 'pt-12 pb-2' : 'py-2'} px-2 rounded-lg ${
				isCompact ? 'h-[120px]' : ''
			} w-full flex flex-col items-stretch overflow-hidden transition-all duration-50 ${
				hideBackground ? 'border-2 border-primary/50' : 'border-white'
			} ${className}`}
		>
			{!hideBackground && (
				<div
					className="absolute inset-0 bg-position-[center_bottom] bg-no-repeat bg-cover rounded-lg"
					style={{
						backgroundImage: `url(${getCanvasBackground(riddle.bg || 'bg1.png')})`,
						filter: 'brightness(0.4)',
					}}
				/>
			)}

			<div
				className={`relative z-10 flex flex-col items-center justify-between w-full ${isCompact ? 'h-full' : 'flex-1'}`}
			>
				{/* Top row: stats for non-web riddles; author (top right) only for web-created riddles */}
				{(!riddle.postId.startsWith('r_') && !hideStats) || (riddle.postId.startsWith('r_') && riddle.author) ? (
					<div className={`flex items-center w-full ${isCompact ? 'justify-end' : 'justify-between'} gap-4`}>
						{!riddle.postId.startsWith('r_') && !hideStats && !isCompact && (
							<div className="flex items-center justify-center gap-2">
								<Image src="/icons/eye.png" alt="Eye" width={28} height={28} className="w-7 h-7" />{' '}
								{riddle.guessCount}
							</div>
						)}
						<div className="flex items-center justify-center gap-2 ml-auto">
							{!riddle.postId.startsWith('r_') && !hideStats && (
								<>
									<Image
										src="/icons/star.png"
										alt="Star"
										width={isCompact ? 16 : 28}
										height={isCompact ? 16 : 28}
										className={isCompact ? 'w-4 h-4' : 'w-7 h-7'}
									/>
									<span className={isCompact ? 'text-xs' : ''}>{formatPopularity(riddle.popularity)}</span>
								</>
							)}
							{riddle.postId.startsWith('r_') && riddle.author && (
								<Link
									href={`/profile/${encodeURIComponent(riddle.author)}`}
									className={`text-primary font-medium hover:underline ${isCompact ? 'text-xs' : ''}`}
									title={riddle.author}
								>
									{riddle.author}
								</Link>
							)}
						</div>
					</div>
				) : null}
				<div
					className={`relative ${
						isCompact
							? 'text-lg w-full text-center flex-1 flex items-center justify-center pt-1 px-1'
							: 'text-2xl w-[95%] md:w-[80%] lg:w-[70%] text-center flex-1 flex items-center justify-center py-4'
					}`}
				>
					<p className={`whitespace-pre-line [text-shadow:2px_2px_0px_black] ${isCompact ? 'line-clamp-2' : textClassName || ''}`}>
						{riddle.riddle}
					</p>
				</div>
				{!hideSolveButton && (
					<div className={`flex items-center w-full pb-2 ${isCompact ? 'justify-end' : 'justify-center'}`}>
						<LinkAsButton
							href={solveHref || `/riddle/${riddle.postId}`}
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
