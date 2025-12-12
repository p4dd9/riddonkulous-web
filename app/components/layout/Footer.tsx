import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className="w-full py-6 px-4 md:mt-24 mt-12">
			<div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-sm">
				<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
					<Link
						href="https://hammertime.studio/en/reddit/terms-of-service"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						Terms of Service
					</Link>
					<span className="hidden md:inline">|</span>
					<Link
						href="https://hammertime.studio/en/reddit/privacy-policy"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						Privacy Policy
					</Link>
					<span className="hidden md:inline">|</span>
					<Link href="/credits" className="hover:underline">
						Credits
					</Link>
					<span className="hidden md:inline">|</span>
					<Link
						href="https://hammertime.studio/en/support-my-work"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline flex items-center gap-2"
					>
						<Image src="/icons/heart.png" alt="Heart" width={16} height={16} />
						Support Riddonkulous
					</Link>
				</div>
				<p className="text-xs">© 2025 Hammertime e.U.</p>
			</div>
		</footer>
	)
}
