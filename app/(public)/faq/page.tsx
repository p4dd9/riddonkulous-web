import { FAQHashHandler } from '@/app/components/faq/FAQHashHandler'
import { FAQItem } from '@/app/components/faq/FAQItem'
import { APP_STORE_URL, PLAY_STORE_URL, SUBREDDIT_URL } from '@/app/lib/appLinks'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const revalidate = false // Static page

const External = ({ href, children }: { href: string; children: ReactNode }) => (
	<Link href={href} target="_blank" rel="noopener noreferrer" className="underline">
		{children}
	</Link>
)

export default async function FAQPage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<FAQHashHandler />
			<div className="w-full max-w-2xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Frequently Asked Questions</h1>
				<div className="flex flex-col gap-4">
					<FAQItem
						id="what-is-riddonkulous"
						question="What is Riddonkulous?"
						answer={
							<p>
								Riddonkulous is a riddle game for iPhone, iPad and Android. You climb a ladder of 1,000
								riddles, with a tougher boss riddle every ten steps. Get it on the{' '}
								<External href={APP_STORE_URL}>App Store</External> or{' '}
								<External href={PLAY_STORE_URL}>Google Play</External>.
							</p>
						}
					/>
					<FAQItem
						id="play-in-browser"
						question="Can I still play on riddonkulous.com?"
						answer={
							<p>
								No. The game now lives in the app only, and this website just points to the stores. The
								daily riddle, the Daily Adventure and the browser login are gone. On Reddit you can
								still solve and share riddles in{' '}
								<External href={SUBREDDIT_URL}>r/Riddonkulous</External>.
							</p>
						}
					/>
					<FAQItem
						id="how-to-play"
						question="How do I play?"
						answer={
							<p>
								Read the riddle, then tap letter tiles to spell the answer. Some tiles are decoys that
								don&apos;t belong in the answer. Solve a riddle to earn coins and experience, and to
								open the next step of the ladder. Stuck? Spend coins on a hint, reveal a letter, remove
								the decoys or skip the riddle. Solving without help earns three stars.
							</p>
						}
					/>
					<FAQItem
						id="is-it-free"
						question="Is Riddonkulous free?"
						answer={
							<p>
								Yes. The whole ladder is free to play. The game shows an ad between some riddles (never
								while you solve one), and you can watch a video for extra coins whenever you like. A
								one-time &quot;Remove ads&quot; purchase turns off the ads between riddles for good.
							</p>
						}
					/>
					<FAQItem
						id="campaigns"
						question="What are campaigns?"
						answer={
							<p>
								Campaigns are themed riddle packs, such as Gods of Olympus or Lions &amp; Legions, each
								with its own ladder and bosses. The first three riddles of every campaign are free to
								try; the rest unlock with a one-time purchase per campaign. Campaigns share your coins
								and experience with the main ladder.
							</p>
						}
					/>
					<FAQItem
						id="account"
						question="Do I need an account?"
						answer={
							<p>
								No. There is no login and no sign-up, and the app never asks for your name or email.
								Your progress is saved on your phone. On Android, Google Play Games adds achievements,
								leaderboards and a cloud copy of your progress if you&apos;re signed in to it.
							</p>
						}
					/>
					<FAQItem
						id="new-phone"
						question="How do I keep my progress on a new phone?"
						answer={
							<p>
								On Android, sign in to Google Play Games with the same Google account and your ladder
								progress and coins come back; Android&apos;s backup to your Google account restores them
								too. On iPhone and iPad, your progress comes back when you restore the new device from
								an iCloud backup. Purchases are never lost: tap &quot;Restore purchases&quot; in the
								app&apos;s settings.
							</p>
						}
					/>
					<FAQItem
						id="restore-purchases"
						question="I bought Remove ads or a campaign but don't have it."
						answer={
							<p>
								Open the app&apos;s settings and tap &quot;Restore purchases&quot;, signed in with the
								same Apple Account or Google account you bought it with. If that doesn&apos;t help,
								email us with the order number from your App Store or Google Play receipt.
							</p>
						}
					/>
					<FAQItem
						id="offline"
						question="Does it work offline?"
						answer="Yes. All riddles are inside the app, so you can play without a connection. Ads, purchases and Google Play Games need one."
					/>
					<FAQItem
						id="ad-privacy"
						question="How do I change my ad privacy choices?"
						answer={
							<p>
								In the European Economic Area, the UK and Switzerland, tap &quot;Privacy choices&quot;
								in the app&apos;s settings. On iPhone, you can also turn tracking off under Settings,
								Privacy &amp; Security, Tracking. Details are in our{' '}
								<Link href="/privacy-policy" className="underline">
									Privacy Policy
								</Link>
								.
							</p>
						}
					/>
					<FAQItem
						id="where-riddles-come-from"
						question="Where do the riddles come from?"
						answer={
							<p>
								From the Riddonkulous community on Reddit. We picked the best-loved riddles, checked
								them and ordered them from easy to hard. Campaign riddles were written by our authors,
								see the{' '}
								<Link href="/credits" className="underline">
									Credits
								</Link>
								.
							</p>
						}
					/>
					<FAQItem
						id="submit-riddle"
						question="Can I submit my own riddle?"
						answer={
							<p>
								Yes, post it in <External href={SUBREDDIT_URL}>r/Riddonkulous</External>. New riddles
								reach the app with updates, so popular ones may end up on the ladder. Please follow our{' '}
								<Link href="/content-policy" className="underline">
									Content Policy
								</Link>
								.
							</p>
						}
					/>
					<FAQItem
						id="report-riddle"
						question="I found a wrong answer or a typo."
						answer="Please email us with the riddle's number on the ladder (or the campaign's name) and what's wrong, and we'll fix it in the next update."
					/>
					<FAQItem
						id="delete-data"
						question="How do I delete my data?"
						answer={
							<p>
								Uninstalling the app deletes your saved game. For purchase records, ad data and backups,
								see &quot;Data Deletion&quot; in our{' '}
								<Link href="/privacy-policy" className="underline">
									Privacy Policy
								</Link>
								.
							</p>
						}
					/>
					<FAQItem
						id="newsletter"
						question="How do I unsubscribe from the newsletter?"
						answer={
							<p>
								Visit{' '}
								<Link href="/unsubscribe" className="underline">
									riddonkulous.com/unsubscribe
								</Link>{' '}
								and sign in with the Google account you subscribed with. You won&apos;t receive it again
								unless you subscribe again.
							</p>
						}
					/>
					<FAQItem
						id="contact"
						question="How can I contact Riddonkulous?"
						answer={
							<p>
								Email us at{' '}
								<a href="mailto:hello@hammertime.studio" className="underline">
									hello@hammertime.studio
								</a>
								. We read every message, including bug reports and riddle corrections.
							</p>
						}
					/>
					<FAQItem
						id="how-to-support"
						question="How can I support this project?"
						answer={
							<p>
								Rate the app in the App Store or on Google Play, tell a friend, or{' '}
								<External href="https://hammertime.studio/en/support-my-work">
									visit our support page
								</External>
								.
							</p>
						}
					/>
				</div>
			</div>
		</div>
	)
}
