import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Privacy Policy | Riddonkulous',
	description:
		'Privacy Policy for Riddonkulous on iOS, Android and riddonkulous.com: what data the app and the website process, who processes it and what rights you have.',
	openGraph: {
		title: 'Privacy Policy | Riddonkulous',
		description:
			'Privacy Policy for Riddonkulous on iOS, Android and riddonkulous.com: what data the app and the website process, who processes it and what rights you have.',
		url: 'https://riddonkulous.com/privacy-policy',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Privacy Policy | Riddonkulous',
		description: 'Privacy Policy for Riddonkulous on iOS, Android and riddonkulous.com.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/privacy-policy',
	},
}

const VERSION = '5 November 2026'
const CONTACT = 'hello@hammertime.studio'

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section className="mb-8">
		<h2 className="text-2xl mb-4 text-white">{title}</h2>
		{children}
	</section>
)

const Sub = ({ children }: { children: ReactNode }) => <h3 className="text-xl mb-3 text-white mt-6">{children}</h3>

const P = ({ children }: { children: ReactNode }) => <p className="text-white/80 mb-4">{children}</p>

const List = ({ items }: { items: ReactNode[] }) => (
	<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
		{items.map((item, index) => (
			<li key={index}>{item}</li>
		))}
	</ul>
)

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
	<a
		href={href}
		target={href.startsWith('http') ? '_blank' : undefined}
		rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
		className="underline text-primary"
	>
		{children}
	</a>
)

const Mail = () => <Link href={`mailto:${CONTACT}`}>{CONTACT}</Link>

export default function PrivacyPolicyPage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Privacy Policy</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Version {VERSION}</p>

					<Section title="Introduction">
						<P>
							Riddonkulous is a riddle game for iPhone, iPad and Android phones and tablets, and the
							website riddonkulous.com, both provided by Hammertime e.U. (&quot;we&quot;, &quot;us&quot;,
							&quot;our&quot;). This Privacy Policy covers the app on iOS and Android and the website. It
							explains what data each processes, who processes it, why, and what rights you have. Where
							the app and the website, or iOS and Android, differ, the difference is pointed out.
						</P>
						<P>
							You do not need an account to play, and the app never asks for your name, email address or
							phone number. Your progress stays on your device. To keep the game free, it shows ads, and
							it offers an optional &quot;Remove ads&quot; purchase; the companies that run these for us
							process some data, as described below.
						</P>
						<P>
							If you have any questions about this policy or your data, please contact us at <Mail />.
						</P>
					</Section>

					<Section title="The Riddonkulous App">
						<Sub>Data on Your Device</Sub>
						<P>The app saves your game on your device:</P>
						<List
							items={[
								'Your progress: which riddles you have solved or skipped, your stars, your experience points, and riddles you have started but not finished',
								'Your coins, and the hints and items you have used on a riddle',
								'Your settings, such as sound effects and vibration, and which ad breaks you have already seen',
							]}
						/>
						<P>
							This data does not leave your device, except through your device&apos;s own backup: on
							Android, if you have turned on backup to your Google account, Android copies your saved game
							there; on iOS, if you have turned on iCloud Backup, Apple includes it in your device backup.
							Either way, your game comes back when you reinstall the app or move to a new device. That
							backup is handled by Google or Apple under your account settings, and we cannot see it.
						</P>
						<P>
							The riddles themselves are part of the app. They were written by the Riddonkulous community
							on Reddit; the app contains only each riddle&apos;s text, its answer, its category and its
							hints, not the names or accounts of the people who wrote them. We may write hints with the
							help of an AI service, which is given only a riddle&apos;s text and answer, never data about
							you.
						</P>

						<Sub>Advertising (Google AdMob)</Sub>
						<P>
							Riddonkulous shows ads between some riddles, served by Google AdMob, a service of Google
							Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Ads are never shown while
							you solve a riddle. You can also choose to watch a video ad to earn coins; that is always up
							to you. You can remove the ads between riddles for good with the &quot;Remove ads&quot;
							purchase.
						</P>
						<P>
							To deliver ads, measure them and prevent fraud, Google&apos;s Mobile Ads SDK in the app
							processes data such as:
						</P>
						<List
							items={[
								"Your device's advertising identifier, where you allow it (see below)",
								'Your IP address, from which Google may estimate your general location',
								'Information about your device, such as its model, operating system and language',
								'How you interact with ads, such as views and taps, and diagnostic information about the app',
							]}
						/>
						<P>
							If you are in the European Economic Area, the United Kingdom or Switzerland, the app asks
							for your consent through Google&apos;s consent message before ads are personalized and
							before information is stored on or read from your device for advertising. You can accept,
							refuse, or choose purposes and partners. On iOS, the app also asks through Apple&apos;s
							&quot;Allow tracking&quot; prompt (App Tracking Transparency) whether Google may use your
							device&apos;s advertising identifier to personalize ads; if you refuse, Google gets no
							advertising identifier. If you refuse either, Google shows non-personalized ads, which are
							based on the general context, such as the game and your approximate location, rather than on
							your profile; Google still processes some of the data above for ad delivery, frequency
							capping, measurement and fraud prevention.
						</P>
						<P>
							You can change or withdraw your consent at any time with &quot;Privacy choices&quot; in the
							app&apos;s settings, where Google&apos;s consent message applies to you. On Android, you can
							also reset or delete your advertising ID under Settings, Privacy, Ads. On iOS, you can
							withdraw tracking permission under Settings, Privacy &amp; Security, Tracking, and turn off
							personalized ads under Settings, Privacy &amp; Security, Apple Advertising.
						</P>
						<P>
							Google uses this data as an independent controller, under its own Privacy Policy (
							<Link href="https://policies.google.com/privacy">policies.google.com/privacy</Link>). How
							Google uses information from apps that use its services is explained at{' '}
							<Link href="https://policies.google.com/technologies/partner-sites">
								policies.google.com/technologies/partner-sites
							</Link>
							.
						</P>

						<Sub>Purchases (App Store, Google Play and RevenueCat)</Sub>
						<P>
							The &quot;Remove ads&quot; purchase is made through Apple&apos;s App Store on iOS and
							through Google Play on Android. Apple or Google handles the payment under its own terms and
							Privacy Policy; we never receive your payment details or your Apple Account&apos;s or Google
							account&apos;s name or email address.
						</P>
						<P>
							To check the purchase and restore it, we use RevenueCat, a service of RevenueCat, Inc. in
							the United States (
							<Link href="https://www.revenuecat.com/privacy">revenuecat.com/privacy</Link>
							), which processes the following on our behalf:
						</P>
						<List
							items={[
								'A random identifier the app creates for you, which is not linked to your name, your Apple Account or Google account, or your advertising identifier',
								'Your purchase history in the app: what you bought, when, at what price and in which currency, and the store’s receipt for it',
								'Basic technical information, such as the app version, your device’s operating system and language, your country and your IP address when the app connects',
							]}
						/>
						<P>
							This lets the app know that you own &quot;Remove ads&quot;, even offline, and restore it on
							a new device. RevenueCat processes this data in the United States; the transfer is covered
							by the EU Standard Contractual Clauses.
						</P>

						<Sub>Usage Statistics (Plausible)</Sub>
						<P>
							To learn how many people play and on which kinds of devices, the app reports page views to
							our own installation of Plausible Analytics, which runs on a server we operate ourselves, so
							the statistics are not shared with anyone. It does not report what you do in the game.
						</P>
						<P>
							Plausible uses no cookies, stores nothing on your device and does not use your advertising
							ID. It turns your IP address and your device&apos;s browser information into an anonymous
							daily identifier that cannot be traced back to you and changes every day, and it does not
							store your IP address. What we see are totals only, such as the number of visitors, their
							countries, and their device types and operating systems.
						</P>
					</Section>

					<Section title="The Website (riddonkulous.com)">
						<P>
							The website introduces the game and links to the App Store and Google Play. Older versions
							of the app (before version 1.0) showed this website inside the app; what follows applies to
							them as well.
						</P>

						<Sub>Usage Statistics (Plausible)</Sub>
						<P>
							The website uses the same self-hosted Plausible Analytics as the app, without cookies and
							without storing your IP address, so we see totals only, such as page views, referring sites,
							countries and device types.
						</P>

						<Sub>Newsletter and Google Sign-In</Sub>
						<P>
							You can subscribe to an optional newsletter with riddles and news about Riddonkulous. To
							subscribe or unsubscribe, you sign in with your Google account (Google Sign-In). We then
							receive and store your email address and an account identifier from Google, when your
							account was created and updated, and your newsletter choice. A session cookie keeps you
							signed in while you manage your subscription. Google processes the sign-in under its own
							Privacy Policy.
						</P>
						<P>
							The newsletter is sent through SMTP2GO, an email service that receives only your email
							address, for delivering the newsletter, and is{' '}
							<Link href="https://www.smtp2go.com/blog/gdpr-compliant/">GDPR compliant</Link>. We do not
							track whether you open the newsletter or click its links. You can unsubscribe at any time at{' '}
							<Link href="/unsubscribe">riddonkulous.com/unsubscribe</Link>, and you will not receive it
							again unless you subscribe again.
						</P>
					</Section>

					<Section title="Why We Process Your Data">
						<List
							items={[
								'To provide the game and the "Remove ads" purchase: saving your progress, checking and restoring the purchase (performance of our agreement with you, Art. 6(1)(b) GDPR)',
								'Personalized ads, and storing or reading information on your device for advertising: only with your consent (Art. 6(1)(a) GDPR and § 165(3) of the Austrian Telecommunications Act 2021), which you can withdraw at any time with effect for the future',
								'Non-personalized ads, which keep the game free, and their measurement and fraud prevention: our legitimate interest in financing the game (Art. 6(1)(f) GDPR)',
								'Usage statistics in the app and on the website: our legitimate interest in understanding how Riddonkulous is used and improving it, without identifying you (Art. 6(1)(f) GDPR)',
								'The newsletter and the sign-in it needs: your consent when you subscribe (Art. 6(1)(a) GDPR), which you can withdraw at any time by unsubscribing',
							]}
						/>
						<P>We do not sell your data, and we do not use it for automated decisions that affect you.</P>
					</Section>

					<Section title="Who Receives Your Data">
						<List
							items={[
								'Google, for ads (AdMob) in the app on both platforms, for payments (Google Play) on Android, for Google Sign-In on the website and, if you turned it on, Android’s backup to your Google account',
								'Apple, for payments (App Store) on iOS and, if you turned it on, iCloud Backup',
								'RevenueCat, which processes purchase data on our behalf',
								'SMTP2GO, which delivers the newsletter on our behalf',
							]}
						/>
						<P>We do not pass your data to anyone else, except where we are required to by law.</P>
					</Section>

					<Section title="Data Retention">
						<P>
							The game saved on your device stays there until you uninstall the app or clear its data.
							Your device&apos;s backup of it, in your Google account or in iCloud, is kept as
							Google&apos;s or Apple&apos;s backup settings describe.
						</P>
						<P>
							RevenueCat keeps your purchase history for as long as we use it to check and restore your
							purchase, and as long as we must keep records of purchases for tax and accounting law,
							usually seven years.
						</P>
						<P>
							Your newsletter account (email address and newsletter choice) is kept until you ask us to
							delete it. Session cookies expire on their own.
						</P>
						<P>
							Plausible keeps only totals that do not identify you. Google keeps advertising data as its
							own Privacy Policy describes.
						</P>
					</Section>

					<Section title="Your Rights">
						<P>
							Under the General Data Protection Regulation (GDPR) and other applicable privacy laws, you
							have the right to:
						</P>
						<List
							items={[
								'Access the personal data we hold about you, and receive a copy of it',
								'Have inaccurate data corrected',
								'Have your data erased',
								'Restrict or object to its processing, including processing based on our legitimate interest',
								'Data portability',
								'Withdraw your consent at any time, without affecting what was done before',
								'Lodge a complaint with a supervisory authority; in Austria, this is the Austrian Data Protection Authority (Datenschutzbehörde)',
							]}
						/>
						<P>
							To exercise any of these rights, please contact us at <Mail />. Because the app has no
							accounts, please include the order number of your &quot;Remove ads&quot; purchase, from your
							Google Play receipt (it starts with &quot;GPA.&quot;) or your App Store receipt email (its
							&quot;Order ID&quot;), so we can find the right records. For the newsletter, please write
							from the email address you subscribed with.
						</P>
					</Section>

					<Section title="Data Deletion">
						<List
							items={[
								'Your saved game: uninstall the app. On Android, you can also clear its storage under Settings, Apps, Riddonkulous. This also resets your coins. To remove the backup of it too, delete the app’s backup in your Google account’s backup settings, or on iOS exclude the app from iCloud Backup under Settings, your name, iCloud, Manage Account Storage, Backups.',
								'Purchase records: email us with the order number from your Google Play or App Store receipt, and we will have RevenueCat delete your customer record, except what tax and accounting law requires us to keep. "Remove ads" can then no longer be restored automatically.',
								'Advertising data: on Android, reset or delete your advertising ID under Settings, Privacy, Ads; on iOS, withdraw tracking permission under Settings, Privacy & Security, Tracking. See Google’s Privacy Policy for the data Google holds.',
								'Newsletter account: unsubscribe at riddonkulous.com/unsubscribe, and email us from that address if you also want the account itself deleted.',
							]}
						/>
					</Section>

					<Section title="Children's Privacy">
						<P>
							Riddonkulous is made for a general audience and is not directed at children under 13. We do
							not knowingly collect personal data from children beyond what is described above. If you
							believe a child has given us data without the consent required in their country, please
							contact us and we will delete it.
						</P>
					</Section>

					<Section title="Security">
						<P>
							All data the app and the website send travels encrypted (HTTPS). The app asks for no
							permissions beyond internet access, the store&apos;s billing and, on iOS, the optional
							tracking permission described above, and it does not access your contacts, photos, location,
							camera or microphone.
						</P>
					</Section>

					<Section title="Who Is Responsible">
						<P>
							The controller responsible for processing your data is Hammertime e.U., <Mail />. Further
							company details are listed in our{' '}
							<Link href="https://hammertime.studio/en/impressum">imprint</Link>.
						</P>
					</Section>

					<Section title="Changes to This Privacy Policy">
						<P>
							We may update this Privacy Policy, for example when the game gains new features or uses a
							new service. Changes take effect once they are posted on this page, and the version date
							below changes with them. If a change affects how we use your data in a significant way, we
							will let you know in the game.
						</P>
						<p className="text-white/70 mb-4">Version {VERSION}</p>
					</Section>
				</div>
			</div>
		</div>
	)
}
