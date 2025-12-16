import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Content Policy | Riddonkulous',
	description: 'Content Policy for Riddonkulous - Guidelines for acceptable content on our platform.',
	openGraph: {
		title: 'Content Policy | Riddonkulous',
		description: 'Content Policy for Riddonkulous - Guidelines for acceptable content on our platform.',
		url: 'https://riddonkulous.com/content-policy',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Content Policy | Riddonkulous',
		description: 'Content Policy for Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/content-policy',
	},
}

export default function ContentPolicyPage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Content Policy</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Last updated: December 2025</p>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Overview</h2>
						<p className="text-white/80 mb-4">
							Riddonkulous is designed as an open and creative environment for playful, clever, and thoughtful riddles. Users should contribute in a way that supports a safe, enjoyable experience for everyone. To maintain a positive and safe environment, all content must adhere to our Content Policy. Violations may result in content removal or account suspension.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Prohibited Content</h2>
						<p className="text-white/80 mb-4">Certain material is strictly disallowed. Content may not:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								<strong>Break any Laws:</strong> Content that violates any applicable laws or regulations
							</li>
							<li>
								<strong>Reveal private or confidential information:</strong> Content that exposes personal or sensitive information about individuals
							</li>
							<li>
								<strong>Constitute spam or disruptive posting:</strong> Repetitive, low-quality, or promotional content that disrupts the community
							</li>
							<li>
								<strong>Imitate others in a deceptive way:</strong> Content that impersonates or misrepresents others
							</li>
							<li>
								<strong>Promote or encourage unnecessary violence, NFTs, Crypto or Gambling:</strong> Content that promotes harmful activities or financial schemes
							</li>
							<li>
								<strong>Threaten, harass, or bully other individuals:</strong> Content that harasses, bullies, or threatens individuals or groups
							</li>
							<li>
								<strong>Hate Speech:</strong> Content that promotes hatred or discrimination based on race, religion, gender, sexual orientation, or other protected characteristics
							</li>
							<li>
								<strong>Copyright Infringement:</strong> Content that violates intellectual property rights
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">NSFW Content</h2>
						<p className="text-white/80 mb-4">
							Content involving nudity, pornography, or material inappropriate for public or professional environments is not permitted within Riddonkulous. The platform is designed for safe-for-work participation across all supported services.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Quality Standards</h2>
						<p className="text-white/80 mb-4">All riddles should meet these quality standards:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Clear and solvable with logical answers</li>
							<li>Proper grammar and spelling</li>
							<li>Appropriate length and complexity</li>
							<li>Original content or properly attributed</li>
							<li>Respectful and appropriate for all ages</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Moderation Process</h2>
						<p className="text-white/80 mb-4">
							All submitted riddles are reviewed by our moderation team. Content that violates this policy may be rejected, removed, or require revision. The approval process may take longer if we detect malicious, poor, or NSFW content. Approval decisions are ultimately up to the moderation team.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Reporting Violations</h2>
						<p className="text-white/80 mb-4">
							If you encounter content that violates this policy, please report it to{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							. We review all reports and take appropriate action.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Consequences</h2>
						<p className="text-white/80 mb-4">
							Violations of this Content Policy may result in:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Content removal</li>
							<li>Warning notifications</li>
							<li>Temporary account suspension</li>
							<li>Permanent account termination</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Contact Us</h2>
						<p className="text-white/80 mb-4">
							If you have questions about this Content Policy, please contact us at{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	)
}

