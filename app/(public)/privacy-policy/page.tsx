import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Privacy Policy | Riddonkulous',
	description: 'Privacy Policy for Riddonkulous - Learn how we collect, use, and protect your personal information.',
	openGraph: {
		title: 'Privacy Policy | Riddonkulous',
		description:
			'Privacy Policy for Riddonkulous - Learn how we collect, use, and protect your personal information.',
		url: 'https://riddonkulous.com/privacy-policy',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Privacy Policy | Riddonkulous',
		description: 'Privacy Policy for Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/privacy-policy',
	},
}

export default function PrivacyPolicyPage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Privacy Policy</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Last updated: December 2025</p>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Introduction</h2>
						<p className="text-white/80 mb-4">
							In the digital world, data plays a crucial role in the operation and enhancement of online
							services, including ours. Recognizing this, we aim to strike a balance between necessary
							data collection for service improvement and our users&apos; right to privacy.
						</p>
						<p className="text-white/80 mb-4">Our Commitment to Data Collection and Privacy:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								Like any online service, we collect data that is essential for delivering and improving
								our services. Our goal is to enhance user experience while minimizing data collection to
								what is strictly necessary.
							</li>
							<li>
								We are committed to respecting your privacy. Therefore, we do not collect data that
								falls into special or sensitive categories, such as racial or ethnic origins, political
								opinions, or religious beliefs. Your personal and sensitive information is your own, and
								we aim to keep it that way.
							</li>
							<li>
								Protecting the privacy of younger users is especially important to us. We do not
								knowingly collect any personal information from minors who fall under certain age
								categories, adhering to the strictest data protection laws.
							</li>
						</ul>
						<p className="text-white/80 mb-4">
							Transparency is the cornerstone of trust. We understand the importance of clear
							communication about our data handling practices. Should you have any inquiries or concerns
							regarding our approach to privacy and data collection, we encourage you to reach out to us
							via{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Collection</h2>
						<p className="text-white/80 mb-4">
							We only collect data necessary to provide and improve our services. We do not collect
							sensitive personal information.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Account Information</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Email address (via Google Sign-In)</li>
							<li>Account identifiers for authentication</li>
							<li>Account creation and update timestamps</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">User-Generated Content</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Riddles you create (word, text, background, explanations)</li>
							<li>Tags and categorization data</li>
							<li>Engagement metrics (scores, guesses, interactions)</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Authentication and Security</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Session tokens for maintaining your login</li>
							<li>Authentication data from Google Sign-In</li>
						</ul>

						<h3 className="text-xl mb-3 text-white mt-6">Usage Data</h3>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Platform usage analytics (anonymized, via Plausible Analytics)</li>
							<li>Riddle engagement and popularity metrics</li>
							<li>Temporary rate limiting data to prevent abuse</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">AI and Machine Learning Usage</h2>
						<p className="text-white/80 mb-4">
							We use AI to help moderate content, generate tags, and enhance platform features. Only
							riddle content (word, text, background, explanation) is sent to AI services - never your
							personal information, email, or account details.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Content Moderation</h3>
						<p className="text-white/80 mb-4">
							AI automatically reviews riddles for safety, quality, and policy compliance. Some content
							may require manual review before being published.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Tag Generation</h3>
						<p className="text-white/80 mb-4">
							AI analyzes riddle content to suggest relevant tags, helping users discover content. Only
							riddle text is used for this purpose.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Platform Features</h3>
						<p className="text-white/80 mb-4">
							AI may be used to generate daily riddles, hints, and other platform features. This does not
							involve your personal data.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Use</h2>
						<p className="text-white/80 mb-4">
							We use your data solely to operate and improve Riddonkulous. This includes:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Providing and maintaining platform functionality</li>
							<li>Authenticating your account and managing access</li>
							<li>Moderating content for safety and quality</li>
							<li>Improving the platform based on usage patterns</li>
							<li>Preventing abuse and spam</li>
							<li>Organizing content with tags and categories</li>
							<li>Tracking engagement to enhance user experience</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Sharing</h2>
						<p className="text-white/80 mb-4">
							We do not sell, rent, or trade your data. We only share data with third-party services
							necessary to operate the platform:
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">AI Service Providers</h3>
						<p className="text-white/80 mb-4">
							For content moderation and tag generation. Only riddle content is shared - no personal
							information.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Google (Authentication)</h3>
						<p className="text-white/80 mb-4">
							For account authentication via Google Sign-In. Only email and authentication identifiers are
							shared, processed according to Google&apos;s privacy policy.
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Plausible Analytics</h3>
						<p className="text-white/80 mb-4">
							For website analytics. GDPR compliant, no personally identifiable information collected, no
							cookies used.{' '}
							<a
								href="https://plausible.io/privacy"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary"
							>
								Privacy Policy
							</a>
						</p>

						<h3 className="text-xl mb-3 text-white mt-6">Database Hosting</h3>
						<p className="text-white/80 mb-4">
							For secure data storage. All data is stored according to industry-standard security
							practices.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Analytics</h2>
						<p className="text-white/80 mb-4">
							We use Plausible Analytics, a privacy-friendly analytics service that is GDPR compliant.
							Plausible does not collect personally identifiable information and does not use cookies. The
							analytics data helps us understand how our platform is used so we can improve the user
							experience.
						</p>

						<p className="text-white/80 mb-4">What We Track:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Page views and navigation patterns</li>
							<li>Referral sources</li>
							<li>Device types and browsers (anonymized)</li>
							<li>General usage statistics</li>
						</ul>

						<p className="text-white/80 mb-4">What We Don&apos;t Track:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Individual user behavior</li>
							<li>Personal identifiers</li>
							<li>Cross-site tracking</li>
							<li>Cookie-based tracking</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Content Moderation</h2>
						<p className="text-white/80 mb-4">
							All riddles are reviewed for safety and quality. Some content may be automatically approved,
							while others require manual review before being published. Rejected or removed content
							remains visible only to the author.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Retention</h2>
						<p className="text-white/80 mb-4">
							Account Data: Retained while your account is active. When you delete your account, your
							account information is removed, but riddles you created remain on the platform (associated
							with your username if provided).
						</p>
						<p className="text-white/80 mb-4">
							Riddle Content: Published riddles are retained indefinitely. Rejected or removed riddles are
							hidden from public view but retained.
						</p>
						<p className="text-white/80 mb-4">
							Session Data: Stored while your session is active and automatically deleted upon expiration.
						</p>
						<p className="text-white/80 mb-4">
							Analytics: Retained according to our analytics provider&apos;s retention policy.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Children&apos;s Privacy</h2>
						<p className="text-white/80 mb-4">
							Our Service does not knowingly collect, use, or disclose personal information from children
							under the age of 13 (or a higher age threshold as required by local laws) without prior
							parental consent or as otherwise permitted by law.
						</p>

						<p className="text-white/80 mb-4">Age Restrictions:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>
								We require users to be at least 13 years old (or the age of majority in their
								jurisdiction)
							</li>
							<li>Google Sign-In requires users to meet Google&apos;s age requirements</li>
							<li>We do not collect age verification data beyond what Google provides</li>
						</ul>

						<p className="text-white/80 mb-4">
							If we become aware that we have collected personal information from a child without verified
							parental consent, we will take prompt action to delete that information.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Your Rights</h2>
						<p className="text-white/80 mb-4">You have the right to:</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Access your personal information and account data</li>
							<li>View all riddles you&apos;ve created</li>
							<li>Request a copy of your data</li>
							<li>Update your personal information (via Google account)</li>
							<li>Delete your account (note: riddles you created remain on the platform)</li>
						</ul>
						<p className="text-white/80 mb-4">
							To exercise these rights, contact us at{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Data Security</h2>
						<p className="text-white/80 mb-4">
							We implement security measures to protect your information, including encrypted sessions,
							secure authentication, database access controls, and HTTPS encryption for all data
							transmission.
						</p>
						<p className="text-white/80 mb-4">
							However, no method of transmission over the Internet is 100% secure. While we use
							commercially acceptable security practices, we cannot guarantee absolute security.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">International Data Transfers</h2>
						<p className="text-white/80 mb-4">
							Your data may be transferred to and processed in countries other than your country of
							residence through our third-party service providers (AI services, Google, database hosting,
							analytics). We ensure appropriate safeguards are in place for international data transfers
							in accordance with applicable data protection laws.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Changes to This Privacy Policy</h2>
						<p className="text-white/80 mb-4">
							We reserve the right to update or modify this Privacy Policy at any time and for any reason,
							without prior notice.
						</p>
						<p className="text-white/80 mb-4">
							Any changes to our Privacy Policy will become effective upon updating the revised policy on
							this page. We encourage you to periodically review this page to stay informed about our
							privacy practices.
						</p>
						<p className="text-white/80 mb-4">Last Updated: December 2025</p>
						<p className="text-white/80 mb-4">
							Your continued use of the Service following any changes or revisions to this Privacy Policy
							signifies your agreement to the updated terms.
						</p>
						<p className="text-white/80 mb-4">
							If you do not agree with the revised Privacy Policy, you should discontinue use of the
							Service immediately.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Contact Us</h2>
						<p className="text-white/80 mb-4">
							If you have questions about this Privacy Policy or wish to exercise your rights, please
							contact us at{' '}
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
