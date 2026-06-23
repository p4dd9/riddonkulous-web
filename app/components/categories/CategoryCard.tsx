import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
	title: string
	description: string
	backgroundImage?: string
	riddleCount: number
	href?: string
	className?: string
}

export const CategoryCard = ({
	title,
	description,
	backgroundImage,
	href = '#',
	className = '',
	riddleCount = 0,
}: CategoryCardProps) => {
	const cardContent = (
		<div
			className={`group relative py-6 px-4 rounded-lg aspect-square w-full flex flex-col border-2 border-primary/40 hover:border-primary hover:-translate-y-1 active:translate-y-0 active:scale-[0.985] transition-all duration-200 ease-out items-center justify-center overflow-hidden cursor-pointer ${className}`}
		>
			<div
				className="absolute inset-0 bg-position-center bg-no-repeat bg-cover rounded-lg transition-transform duration-300 ease-out group-hover:scale-105"
				style={{
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
					filter: backgroundImage ? 'brightness(0.5)' : 'none',
				}}
			/>
			<div className="relative z-10 flex flex-col items-center justify-between text-center px-4 h-full py-4">
				<div className="flex flex-col items-center justify-center flex-1">
					<h3 className="text-lg md:text-3xl mb-2">{title}</h3>
					<p className="text-sm md:text-base opacity-90">{description}</p>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Image src="/icons/script_text.png" alt="Riddles" width={20} height={20} className="w-5 h-5" />
					<p className="text-sm md:text-base">{riddleCount}</p>
				</div>
			</div>
		</div>
	)

	if (href === '#') {
		return cardContent
	}

	return (
		<Link href={href} className="block w-full">
			{cardContent}
		</Link>
	)
}
