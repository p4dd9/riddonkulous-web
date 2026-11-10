import { TwitchIcon } from '@/app/components/PlatformsSection'
import { PromoCodeButton } from '@/app/components/playInApp/PromoCodeButton'
import { StoreButtons } from '@/app/components/playInApp/StoreButtons'
import { SUBREDDIT_URL, TWITCH_EXTENSION_URL } from '@/app/lib/appLinks'
import Image from 'next/image'

const RedditIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
		<path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286A.72.72 0 0 0 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199a1.999 1.999 0 1 1-1.947 2.46v.002a2.368 2.368 0 0 0-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363a2.802 2.802 0 1 1 2.908 4.753c-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87a2.8 2.8 0 0 1 1.189-5.34c.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01a3.229 3.229 0 0 1 2.88-3.207 2 2 0 0 1 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135a.222.222 0 0 0-.183.305 3.199 3.199 0 0 0 2.953 1.964 3.2 3.2 0 0 0 2.953-1.964.222.222 0 0 0-.184-.305 27.75 27.75 0 0 0-2.769-.135Z" />
	</svg>
)

const otherPlaces = [
	{
		key: 'reddit',
		href: SUBREDDIT_URL,
		icon: <RedditIcon />,
		iconClassName: 'text-[#FF4500]',
		intro: 'On Reddit? Solve and share riddles in',
		link: 'r/Riddonkulous',
	},
	{
		key: 'twitch',
		href: TWITCH_EXTENSION_URL,
		icon: <TwitchIcon />,
		iconClassName: 'text-[#9146FF]',
		intro: 'Streaming? Play along live',
		link: 'with the Twitch extension',
	},
] as const

/**
 * The whole site in a regular browser: Riddonkulous is played in the iOS /
 * Android apps (and on Reddit and Twitch), so the web only points there.
 */
export const AppLanding = () => (
	<div className="relative h-full min-h-[70vh] w-full flex flex-col items-center justify-center max-w-5xl mx-auto px-4 py-10 md:py-16 gap-10 md:gap-14">
		<section className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
			<Image
				src="/pals/frog_magician.gif"
				alt=""
				width={224}
				height={224}
				className="w-32 h-32 md:w-56 md:h-56 shrink-0"
				aria-hidden
				unoptimized
				priority
			/>
			<div className="flex flex-col gap-4 md:gap-6 items-center md:items-start">
				<h1 className="text-4xl md:text-6xl">Play Riddonkulous on your phone</h1>
				<p className="text-base md:text-xl opacity-80 max-w-2xl">
					Climb a ladder of 1,000 community riddles, beat a boss every ten steps and unlock themed campaigns.
					Free on iOS and Android, and it works offline.
				</p>
				<StoreButtons />
				<ul className="flex flex-col gap-2 items-center md:items-start">
					{otherPlaces.map((place) => (
						<li key={place.key} className="flex items-center gap-2 text-sm md:text-lg opacity-80">
							<span
								className={`shrink-0 [&_svg]:w-5 [&_svg]:h-5 md:[&_svg]:w-6 md:[&_svg]:h-6 ${place.iconClassName}`}
							>
								{place.icon}
							</span>
							<span>
								{place.intro}{' '}
								<a
									href={place.href}
									target="_blank"
									rel="noopener noreferrer"
									className="underline hover:text-primary transition-colors"
								>
									{place.link}
								</a>
							</span>
						</li>
					))}
				</ul>
				<PromoCodeButton />
			</div>
		</section>
	</div>
)
