import { AndroidIcon, AppleIcon } from '@/app/components/PlatformsSection'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/app/lib/appLinks'

const stores = [
	{ key: 'android', label: 'Google Play', sublabel: 'Get it on', href: PLAY_STORE_URL, icon: <AndroidIcon /> },
	{ key: 'ios', label: 'App Store', sublabel: 'Download on the', href: APP_STORE_URL, icon: <AppleIcon /> },
] as const

interface StoreButtonsProps {
	className?: string
}

/** Google Play + App Store buttons: stacked on narrow screens, large side by side on desktop. */
export const StoreButtons = ({ className = '' }: StoreButtonsProps) => (
	<div className={`w-full sm:w-auto flex flex-col sm:flex-row gap-3 md:gap-5 ${className}`}>
		{stores.map((store) => (
			<a
				key={store.key}
				href={store.href}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center justify-center sm:justify-start gap-3 md:gap-4 px-5 py-3 md:px-8 md:py-4 md:min-w-64 rounded-lg bg-primary text-bg shadow-[0_6px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.7)] hover:translate-y-[4px] active:translate-y-[5px] transition-all duration-150 [&_svg]:w-8 [&_svg]:h-8 md:[&_svg]:w-11 md:[&_svg]:h-11"
			>
				{store.icon}
				<span className="flex flex-col leading-none text-left gap-1">
					<span className="text-sm md:text-base opacity-80">{store.sublabel}</span>
					<span className="text-2xl md:text-4xl">{store.label}</span>
				</span>
			</a>
		))}
	</div>
)
