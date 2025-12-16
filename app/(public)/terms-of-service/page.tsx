import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Terms of Service | Riddonkulous',
	description: 'Terms of Service for Riddonkulous - Read our terms and conditions for using the platform.',
	openGraph: {
		title: 'Terms of Service | Riddonkulous',
		description: 'Terms of Service for Riddonkulous - Read our terms and conditions for using the platform.',
		url: 'https://riddonkulous.com/terms-of-service',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Terms of Service | Riddonkulous',
		description: 'Terms of Service for Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/terms-of-service',
	},
}

export default function TermsOfServicePage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Terms of Service</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Last updated: December 2025</p>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Introduction</h2>
						<p className="text-white/80 mb-4">
							These Terms of Service (&quot;Terms&quot;) govern your use of Riddonkulous (referred to as
							&quot;App,&quot; &quot;Service,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
							and any related services provided by Hammertime e.U. By accessing or using our App, you
							agree to be bound by these Terms. If you do not agree to these Terms, you may not use our
							App. Please read these Terms carefully before accessing or using our Services.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Use of Our App</h2>
						<p className="text-white/80 mb-4">
							Use of the App requires an active account. You can create an account using Google Sign-In
							authentication. By using the App, users affirm they possess an account in good standing.
						</p>
						<p className="text-white/80 mb-4">
							User identification and management are conducted through your account credentials. You can
							manage your account settings, including username and profile information, through the
							App&apos;s user dashboard.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">User Conduct</h2>
						<p className="text-white/80 mb-4">
							Users are expected to engage with the Riddonkulous community respectfully, fostering a
							positive and welcoming environment for everyone.
						</p>
						<p className="text-white/80 mb-4">
							Users must behave courteously and refrain from harassment, bullying, or using derogatory
							language. Prohibited activities include, but are not limited to:
						</p>
						<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
							<li>Engaging in harassment, threats, or abuse toward other users</li>
							<li>Using the App to conduct or promote illegal activities</li>
							<li>Exploiting or hacking the App for unintended purposes</li>
							<li>Creating or sharing discriminatory, obscene, or offensive content through the App</li>
						</ul>
						<p className="text-white/80 mb-4">
							Violations of these guidelines may result in corrective actions, including temporary
							suspension or permanent revocation of access. Users are encouraged to report misconduct to{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Minimum Age Requirements</h2>
						<p className="text-white/80 mb-4">
							Users must meet minimum age requirements to access or use the App. Users must be at least 13
							years old. Individuals between 13 and 18 years old (or the age of majority in their
							jurisdiction) must have permission from a parent or legal guardian. By using the App, you
							confirm that you meet these requirements.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Monitoring</h2>
						<p className="text-white/80 mb-4">
							Hammertime e.U. is not necessarily obligated to monitor the App but retains the right to
							review and remove content at its discretion. However, we are committed to monitoring and
							observing user-generated content on a regular basis. We may also inspect communications sent
							via the App for security purposes and disclose information as required by law.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Intellectual Property</h2>
						<p className="text-white/80 mb-4">
							All content available through the App, including but not limited to images, logos, and
							user-generated content, remains the intellectual property of its respective creators or
							Hammertime e.U., as applicable.
						</p>
						<p className="text-white/80 mb-4">
							User-created content remains the property of the user, provided that such content does not
							violate our Policies or infringe upon the rights of original creators or third parties.
							Hammertime reserves the right to use such content within its apps, games or other services
							on any of the following platforms: Reddit, Discord, Twitch, Websites or native Apps.
						</p>
						<p className="text-white/80 mb-4">
							User-generated content must adhere to our policies, including guidelines on copyright,
							originality, and appropriate use. Redistribution, resale, or commercial exploitation of
							user-generated content, without proper authorization or as permitted by our policies, is
							strictly prohibited.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">LLM Usage</h2>
						<p className="text-white/80 mb-4">
							Our apps utilize Large Language Models (LLMs) in compliance with applicable guidelines and
							regulations.
						</p>
						<p className="text-white/80 mb-4">
							To ensure data integrity and security, apps do not directly interact with LLM APIs. Instead,
							all AI-powered actions are routed through an app-specific backend service. This backend
							validates inputs and structures the data before any interaction with the LLM, providing an
							additional layer of control and compliance.
						</p>
						<p className="text-white/80 mb-4">
							By utilizing AI features within the app, you agree to conduct positive, respectful, and
							community-focused interactions. At no point may you violate these terms, cause harm to
							either communities, the App, or its infrastructure.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Access Control</h2>
						<p className="text-white/80 mb-4">
							Hammertime e.U. reserves the right to revoke access to the App and its services at any time
							without prior notice, particularly in cases of violations of these Terms or our Content
							Policy.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Limitation of Liability</h2>
						<p className="text-white/80 mb-4">
							Riddonkulous is provided &quot;as is&quot; without warranties of any kind. We shall not be
							liable for any damages arising from your use of the service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Changes to This Terms of Service</h2>
						<p className="text-white/80 mb-4">
							We reserve the right to update or modify these Terms of Service at any time and for any
							reason, without prior notice.
						</p>
						<p className="text-white/80 mb-4">
							Any changes to our Terms of Service will become effective upon updating the revised terms on
							this page. We encourage you to periodically review this page to stay informed about our
							terms.
						</p>
						<p className="text-white/80 mb-4">
							Your continued use of the Service following any changes or revisions to these Terms of
							Service signifies your agreement to the updated terms.
						</p>
						<p className="text-white/80 mb-4">
							If you do not agree with the revised Terms of Service, you should discontinue use of the
							Service immediately.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Translation</h2>
						<p className="text-white/80 mb-4">
							The original version of these Terms of Service is in English. While translations may be
							provided, the English version will take precedence in case of discrepancies.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl mb-4 text-white">Contact Us</h2>
						<p className="text-white/80 mb-4">
							If you have questions about these Terms of Service, please contact us at{' '}
							<a href="mailto:hello@hammertime.studio" className="underline text-primary">
								hello@hammertime.studio
							</a>
							.
						</p>
					</section>

					<p className="text-white/60 text-sm mt-8">
						These Terms of Service are influenced by Automattic Terms of Service, licensed under CC-BY-SA
						4.0.
					</p>
				</div>
			</div>
		</div>
	)
}
