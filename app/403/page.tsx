import Image from 'next/image'

export default function ForbiddenPage() {
	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-2xl flex flex-col gap-6 items-center">
				<div className="flex justify-center mb-4">
					<Image
						src="/pals/PAL056.gif"
						alt="Forbidden"
						width={200}
						height={200}
						className="object-contain"
						unoptimized
					/>
				</div>
				<h1 className="text-3xl md:text-4xl text-center mb-4">Halt! Access Denied!</h1>
				<p className="text-gray-300 text-center mb-6">
					By order, you are not permitted to pass beyond this point.
				</p>
			</div>
		</div>
	)
}
