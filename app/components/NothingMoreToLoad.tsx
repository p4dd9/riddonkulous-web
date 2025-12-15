import Image from 'next/image'

export const NothingMoreToLoad = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center gap-4 py-8">
			<div className="flex justify-center">
				<Image
					src="/pals/PAL011.gif"
					alt="End of feed"
					width={200}
					height={200}
					className="object-contain"
					unoptimized
				/>
			</div>
			<h2 className="text-2xl md:text-3xl text-center">Och, Ye Reached The End!</h2>
			<p className="text-gray-300 text-center max-w-md">
				Me pot o&apos; gold says there be no more riddles here, laddie! Ye&apos;ve seen them all.
			</p>
		</div>
	)
}
