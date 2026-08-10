import { RateAppFooterLink } from '@/app/components/layout/RateAppFooterLink'
import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className="w-full py-6 px-4 md:mt-24 mt-12">
			<div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-sm">
				<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
					<Link href="/terms-of-service" className="hover:underline">
						Terms of Service
					</Link>
					<span className="hidden md:inline">|</span>
					<Link href="/content-policy" className="hover:underline">
						Content Policy
					</Link>
					<span className="hidden md:inline">|</span>
					<Link href="/privacy-policy" className="hover:underline">
						Privacy Policy
					</Link>
					<span className="hidden md:inline">|</span>
					<Link href="/about-us" className="hover:underline">
						About Us
					</Link>
					<span className="hidden md:inline">|</span>
					<Link href="/faq#contact" className="hover:underline">
						Contact
					</Link>
					<span className="hidden md:inline">|</span>
					<Link href="/credits" className="hover:underline">
						Credits
					</Link>
					<RateAppFooterLink />
				</div>
				<p className="text-xs">© 2025-Present Hammertime e.U.</p>
			</div>
		</footer>
	)
}
