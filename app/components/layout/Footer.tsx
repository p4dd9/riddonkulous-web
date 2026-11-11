import { RateAppFooterLink } from '@/app/components/layout/RateAppFooterLink'
import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className="w-full py-6 px-4 md:mt-24 mt-12">
			<div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-base text-[var(--color-muted)]">
				<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
					<Link href="/terms-of-service" className="hover:text-primary transition-colors">
						Terms of Service
					</Link>
					<Link href="/content-policy" className="hover:text-primary transition-colors">
						Content Policy
					</Link>
					<Link href="/privacy-policy" className="hover:text-primary transition-colors">
						Privacy Policy
					</Link>
					<Link href="/faq#contact" className="hover:text-primary transition-colors">
						Contact
					</Link>
					<Link href="/credits" className="hover:text-primary transition-colors">
						Credits
					</Link>
					<RateAppFooterLink />
				</div>
				<p className="text-sm text-[var(--color-faint)]">© 2025-Present Hammertime e.U.</p>
			</div>
		</footer>
	)
}
