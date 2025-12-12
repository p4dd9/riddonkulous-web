import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import Image from 'next/image'
import './globals.css'

export default function NotFound() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-2xl flex flex-col gap-6 items-center">
				<div className="flex justify-center mb-4">
					<Image
						src="/pals/PAL011.gif"
						alt="Page not found"
						width={200}
						height={200}
						className="object-contain"
						unoptimized
					/>
				</div>
				<h1 className="text-3xl md:text-4xl  text-center mb-4">Och, This Page Be Gone!</h1>
				<p className="text-gray-300 text-center mb-6">
					Me pot o&apos; gold says this page doesn&apos;t exist, laddie! Try lookin&apos; elsewhere, ye might
					have better luck.
				</p>
				<LinkAsButton href="/" text="Trust the Leprechaun" className="px-4 py-2" textAlign="center" />
			</div>
		</div>
	)
}
