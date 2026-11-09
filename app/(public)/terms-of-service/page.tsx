import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Terms of Service | Riddonkulous',
	description: 'Terms of Service for the Riddonkulous app for iOS and Android and the website riddonkulous.com.',
	openGraph: {
		title: 'Terms of Service | Riddonkulous',
		description: 'Terms of Service for the Riddonkulous app for iOS and Android and the website riddonkulous.com.',
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

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section className="mb-8">
		<h2 className="text-2xl mb-4 text-white">{title}</h2>
		{children}
	</section>
)

const P = ({ children }: { children: ReactNode }) => <p className="text-white/80 mb-4">{children}</p>

const Mail = () => (
	<a href="mailto:hello@hammertime.studio" className="underline text-primary">
		hello@hammertime.studio
	</a>
)

export default function TermsOfServicePage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Terms of Service</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Last updated: 9 November 2026</p>

					<Section title="Introduction">
						<P>
							These Terms of Service (&quot;Terms&quot;) govern your use of the Riddonkulous app for iOS
							and Android and the website riddonkulous.com (together the &quot;App&quot;), provided by
							Hammertime e.U. (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By installing or using
							the App, you agree to these Terms. If you do not agree, please do not use the App. The terms
							of the store you downloaded it from (Apple&apos;s App Store or Google Play) apply as well.
						</P>
					</Section>

					<Section title="Using the App">
						<P>
							Riddonkulous is a riddle game. You do not need an account to play: your progress is saved on
							your device, and on Android optionally in Google Play Games. We are not responsible for
							progress lost when you uninstall the App, clear its data or change devices without a backup.
						</P>
						<P>
							The website only introduces the game and links to the stores. Riddles are no longer played on
							riddonkulous.com, and the website has no user accounts.
						</P>
						<P>
							Please do not cheat, hack, reverse engineer or otherwise misuse the App, its purchases or its
							leaderboards, and do not use it for anything illegal.
						</P>
					</Section>

					<Section title="Ads">
						<P>
							The App is free and shows ads between some riddles. You can also choose to watch video ads
							for coins. How ads use your data is described in our{' '}
							<a href="/privacy-policy" className="underline text-primary">
								Privacy Policy
							</a>
							.
						</P>
					</Section>

					<Section title="Purchases">
						<P>
							The App offers one-time purchases: &quot;Remove ads&quot;, which turns off the ads between
							riddles for good, and themed riddle campaigns, each unlocked by its own purchase (the first
							riddles of every campaign are free to try). Purchases are made and billed through the App
							Store or Google Play under their terms, including their refund rules, and can be restored on
							another device signed in to the same Apple Account or Google account with &quot;Restore
							purchases&quot; in the App&apos;s settings. Video ads you choose to watch for coins are not
							affected by &quot;Remove ads&quot;.
						</P>
						<P>
							Coins, stars, experience and items exist only inside the game. They cannot be bought, have no
							money value, cannot be exchanged or transferred, and may be adjusted when we balance the
							game.
						</P>
					</Section>

					<Section title="Minimum Age">
						<P>
							Riddonkulous is made for a general audience. If you are under the age at which you may agree
							to these Terms where you live, please use the App, and especially make purchases, only with
							the permission of a parent or legal guardian.
						</P>
					</Section>

					<Section title="Intellectual Property">
						<P>
							The App, its design, artwork, code and selection of riddles belong to Hammertime e.U. or are
							used under license from their creators, who are listed on our{' '}
							<a href="/credits" className="underline text-primary">
								Credits page
							</a>
							. Many riddles were first shared by the Riddonkulous community on Reddit, and their authors
							keep the rights to their own riddles. You may not copy, redistribute or sell the App&apos;s
							content or artwork.
						</P>
						<P>
							If you post riddles in r/Riddonkulous, you allow us to use them in our apps, games and other
							services, including the Riddonkulous app, on Reddit, Twitch, websites and native apps. Please
							follow our{' '}
							<a href="/content-policy" className="underline text-primary">
								Content Policy
							</a>
							.
						</P>
					</Section>

					<Section title="Changes and Availability">
						<P>
							We may change, add or remove riddles and features, and update these Terms. Changes take
							effect once they are posted on this page, and the date above changes with them. If you keep
							using the App after a change, you accept the updated Terms. Purchases you made stay yours.
						</P>
					</Section>

					<Section title="Limitation of Liability">
						<P>
							Riddonkulous is provided &quot;as is&quot; without warranties of any kind, to the extent the
							law allows. We are not liable for damages arising from your use of the App, except where
							liability cannot be excluded by law, such as for intent or gross negligence. Your statutory
							rights as a consumer remain unaffected.
						</P>
					</Section>

					<Section title="Governing Law">
						<P>
							These Terms are governed by Austrian law, without its conflict-of-law rules. If you are a
							consumer, the mandatory consumer protection laws of the country you live in still apply.
						</P>
					</Section>

					<Section title="Translation">
						<P>
							The original version of these Terms is in English. If a translation differs, the English
							version takes precedence.
						</P>
					</Section>

					<Section title="Contact Us">
						<P>
							If you have questions about these Terms, please contact us at <Mail />. Company details are
							listed in our{' '}
							<a
								href="https://hammertime.studio/en/impressum"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary"
							>
								imprint
							</a>
							.
						</P>
					</Section>
				</div>
			</div>
		</div>
	)
}
