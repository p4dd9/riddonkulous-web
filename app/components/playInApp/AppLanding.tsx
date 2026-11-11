import { TwitchIcon } from '@/app/components/PlatformsSection'
import { PromoCodeButton } from '@/app/components/playInApp/PromoCodeButton'
import { RiddleDemo } from '@/app/components/playInApp/RiddleDemo'
import { StoreButtons } from '@/app/components/playInApp/StoreButtons'
import { SUBREDDIT_URL, TWITCH_EXTENSION_URL } from '@/app/lib/appLinks'

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
		iconClassName: 'text-[#b78cff]',
		intro: 'Streaming? Play along live',
		link: 'with the Twitch extension',
	},
] as const

const features = [
	{
		key: 'ladder',
		icon: '/gui/icon_star.png',
		title: '1,000 riddles',
		text: 'One long ladder of community riddles. Up to three stars for every solve.',
	},
	{
		key: 'boss',
		icon: '/gui/icon_badge_gold.png',
		title: 'A boss every ten',
		text: 'Every tenth step is a hard classic that guards the way up.',
	},
	{
		key: 'coins',
		icon: '/gui/icon_score_coin.png',
		title: 'Coins and items',
		text: 'Every solve pays coins. Spend them on reveals, hints and skips.',
	},
] as const

/**
 * The whole site in a regular browser: Riddonkulous is played in the iOS /
 * Android apps (and on Reddit and Twitch), so the web only points there. It
 * wears the app's look (Dark Stone kit, Bubblegum Sans) and lets visitors
 * try a few ladder riddles in a Pixi canvas (RiddleDemo).
 */
export const AppLanding = () => (
	<div className="relative w-full max-w-6xl mx-auto px-4 py-8 md:py-14 flex flex-col gap-12 md:gap-16">
		<div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-[1fr_390px] lg:gap-x-14 lg:gap-y-8 lg:items-center">
			<section className="flex flex-col gap-5 md:gap-6 items-center lg:items-start text-center lg:text-left lg:self-end">
				<h1 className="text-[3.25rem] leading-none sm:text-7xl lg:text-8xl uppercase">Riddonkulous</h1>
				<p className="stone-ribbon text-xl md:text-2xl whitespace-nowrap">The riddle game for your phone</p>
				<p className="text-lg md:text-2xl text-[var(--color-muted)] max-w-xl">
					Read the riddle, spell the answer. Climb a ladder of 1,000 community riddles, beat a boss every ten
					steps and unlock themed campaigns. Free on iOS and Android, and it works offline.
				</p>
				<StoreButtons />
			</section>

			<section className="w-full flex flex-col items-center gap-3 lg:col-start-2 lg:row-start-1 lg:row-span-2">
				<RiddleDemo />
				<p className="text-base md:text-lg text-[var(--color-muted)]">Try it: tap the letters to spell the answer.</p>
			</section>

			<section className="w-full flex flex-col gap-4 items-center lg:items-start lg:self-start">
				<ul className="stone-panel w-full max-w-xl flex flex-col gap-3 px-3 py-2">
					{otherPlaces.map((place) => (
						<li key={place.key} className="flex items-center gap-3 text-base md:text-xl">
							<span className={`shrink-0 [&_svg]:w-6 [&_svg]:h-6 md:[&_svg]:w-7 md:[&_svg]:h-7 ${place.iconClassName}`}>
								{place.icon}
							</span>
							<span>
								{place.intro}{' '}
								<a
									href={place.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline hover:text-secondary transition-colors"
								>
									{place.link}
								</a>
							</span>
						</li>
					))}
				</ul>
				<PromoCodeButton />
			</section>
		</div>

		<section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="What is in the app">
			{features.map((feature) => (
				<div key={feature.key} className="stone-card flex items-center gap-4 px-2 py-1">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={feature.icon} alt="" className="w-14 h-14 shrink-0 object-contain" aria-hidden />
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl text-gold">{feature.title}</h2>
						<p className="text-base md:text-lg text-[var(--color-muted)] leading-snug">{feature.text}</p>
					</div>
				</div>
			))}
		</section>
	</div>
)
