import Image from 'next/image'

export const Header = () => {
	return (
		<header className="w-full flex items-center justify-between py-2 px-2 border-b-2 border-(--color-primary)">
			<div className="flex items-center justify-center gap-2">
				<Image src="/img/detective.png" alt="Riddonkulous" width={32} height={32} />
				<h1>Riddonkulous</h1>
			</div>

			<div></div>
		</header>
	)
}
