import { LinkAsButton } from '@/app/components/buttons/LinkAsButton'
import { PLAY_STORE_URL, TWITCH_EXTENSION_URL } from '@/app/lib/appLinks'
import type { ReactNode } from 'react'

const AndroidIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-10 h-10">
		<path d="M17.523 15.341c-.551 0-.999-.449-.999-1s.448-1 .999-1 .999.449.999 1-.448 1-.999 1m-11.046 0c-.551 0-.999-.449-.999-1s.448-1 .999-1 .999.449.999 1-.448 1-.999 1m11.405-6.02 1.997-3.459a.416.416 0 0 0-.152-.568.416.416 0 0 0-.568.152l-2.022 3.503C15.59 8.244 13.853 7.851 12 7.851s-3.59.393-5.137 1.079L4.841 5.427a.416.416 0 0 0-.568-.152.416.416 0 0 0-.152.568l1.997 3.459C2.689 11.187.343 14.659 0 18.761h24c-.344-4.102-2.689-7.574-6.118-9.44" />
	</svg>
)

const AppleIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-10 h-10">
		<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.63-3.325c.837-1.013 1.4-2.42 1.245-3.831-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.72-.688 3.559-1.7z" />
	</svg>
)

const TwitchIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-10 h-10">
		<path d="M6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L23.143 12V0Zm15.428 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h14.571ZM11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714Z" />
	</svg>
)

const platforms: {
	key: string
	title: string
	description: string
	href: string
	cta: string
	disabled: boolean
	icon: ReactNode
	iconClassName: string
}[] = [
	{
		key: 'android',
		title: 'Android',
		description: 'Solve on the go with the Android app.',
		href: PLAY_STORE_URL,
		cta: 'Get App',
		disabled: false,
		icon: <AndroidIcon />,
		iconClassName: 'text-[#3DDC84]',
	},
	{
		key: 'ios',
		title: 'iOS',
		description: 'iPhone & iPad app — coming soon.',
		href: '',
		cta: 'TBD',
		disabled: true,
		icon: <AppleIcon />,
		iconClassName: 'text-white',
	},
	{
		key: 'twitch',
		title: 'Twitch',
		description: 'Play along live with the Twitch extension.',
		href: TWITCH_EXTENSION_URL,
		cta: 'Get Extension',
		disabled: false,
		icon: <TwitchIcon />,
		iconClassName: 'text-[#9146FF]',
	},
]

export const PlatformsSection = () => (
	<section className="w-full flex flex-col gap-4">
		<div className="flex flex-col gap-1 text-center">
			<h2 className="text-xl md:text-2xl">Play Everywhere</h2>
			<p className="text-sm md:text-base opacity-75">Riddonkulous on your phone and on Twitch</p>
		</div>
		<div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
			{platforms.map((platform) => (
				<div
					key={platform.key}
					className="relative py-6 px-4 rounded-lg border-2 border-primary/30 w-full flex flex-col items-center justify-center gap-1 text-center"
				>
					<div className={`mb-3 ${platform.iconClassName}`}>{platform.icon}</div>
					<h3 className="text-xl md:text-2xl">{platform.title}</h3>
					<p className="text-sm md:text-base opacity-90 mb-3">{platform.description}</p>
					<LinkAsButton
						href={platform.href}
						text={platform.cta}
						textAlign="center"
						customClass="px-8 py-1"
						target={platform.disabled ? undefined : '_blank'}
						rel={platform.disabled ? undefined : 'noopener noreferrer'}
						disabled={platform.disabled}
					/>
				</div>
			))}
		</div>
	</section>
)
