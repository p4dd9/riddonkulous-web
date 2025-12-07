import Image from 'next/image'

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center ">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
				<Image
					className="dark:invert"
					src="/img/detective_think.gif"
					alt="Next.js logo"
					width={100}
					height={20}
					unoptimized
					priority
				/>
			</main>
		</div>
	)
}
