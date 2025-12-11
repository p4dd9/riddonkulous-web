import Image from 'next/image'
import { LinkAsButton } from '../buttons/LinkAsButton'

export const Header = () => {
	return (
		<header className="w-full flex items-center justify-between py-2 px-2 border-b-2 border-(--color-primary)">
			<div className="flex items-center justify-center gap-2">
				<Image src="/img/detective.png" alt="Riddonkulous" width={32} height={32} />
				<h1>Riddonkulous</h1>
			</div>

			<div className="flex items-center justify-center gap-2">
				<LinkAsButton
					href="https://www.reddit.com/r/riddonkulous"
					className="text-sm py-2 flex items-center gap-2"
					icon="/icons/pencil.png"
					target="_blank"
					rel="noopener noreferrer"
					iconClass="w-4 h-4"
				>
					Create
				</LinkAsButton>
			</div>
		</header>
	)
}
