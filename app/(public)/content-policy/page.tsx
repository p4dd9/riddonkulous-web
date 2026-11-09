import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Content Policy | Riddonkulous',
	description:
		'Content Policy for Riddonkulous: what riddles belong in the game and in r/Riddonkulous, and how to report a problem.',
	openGraph: {
		title: 'Content Policy | Riddonkulous',
		description:
			'Content Policy for Riddonkulous: what riddles belong in the game and in r/Riddonkulous, and how to report a problem.',
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

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section className="mb-8">
		<h2 className="text-2xl mb-4 text-white">{title}</h2>
		{children}
	</section>
)

const P = ({ children }: { children: ReactNode }) => <p className="text-white/80 mb-4">{children}</p>

const List = ({ items }: { items: string[] }) => (
	<ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
		{items.map((item) => (
			<li key={item}>{item}</li>
		))}
	</ul>
)

const Mail = () => (
	<a href="mailto:hello@hammertime.studio" className="underline text-primary">
		hello@hammertime.studio
	</a>
)

export default function ContentPolicyPage() {
	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl text-center mb-4">Content Policy</h1>

				<div className="prose prose-invert max-w-none">
					<p className="text-white/70 mb-4">Last updated: 9 November 2026</p>

					<Section title="Overview">
						<P>
							Riddonkulous is a place for playful, clever and family-friendly riddles. Players cannot post
							anything inside the app: every riddle in it was chosen and checked by us before it shipped.
							Many of them were first shared by the community in{' '}
							<a
								href="https://www.reddit.com/r/Riddonkulous"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary"
							>
								r/Riddonkulous
							</a>
							, and this policy describes what a riddle needs to be considered for the game. Posts on Reddit
							also follow Reddit&apos;s rules and the subreddit&apos;s rules.
						</P>
					</Section>

					<Section title="Not Allowed">
						<P>Riddles may not:</P>
						<List
							items={[
								'Break any laws or regulations',
								'Reveal private or confidential information about anyone',
								'Be spam, advertising or repeated low-effort posts',
								'Impersonate or misrepresent others',
								'Promote violence, alcohol, drugs, gambling, crypto or NFTs',
								'Threaten, harass or bully anyone',
								'Contain hate speech or discrimination against any group',
								'Infringe copyright or other intellectual property',
								'Contain nudity, sexual content, gore or dark jokes',
							]}
						/>
					</Section>

					<Section title="What Makes a Good Riddle">
						<List
							items={[
								'Clear and solvable: the answer follows from the clues',
								'A single answer that fits the clues, spelled correctly',
								'Proper grammar and spelling',
								'Short enough to read at a glance, long enough to give fair clues',
								'Original, or credited to its source',
								'Fun for all ages',
							]}
						/>
					</Section>

					<Section title="How Riddles Reach the Game">
						<P>
							We pick riddles for the game by how much the community enjoyed them and review each one by
							hand before it ships in an update. We may shorten riddles, fix spelling and write hints for
							them. Whether a riddle is used is up to us.
						</P>
					</Section>

					<Section title="Reporting a Problem">
						<P>
							If a riddle in the game is wrong, unclear or inappropriate, please email <Mail /> with its
							number on the ladder (or the campaign&apos;s name). We review every report and fix or remove
							riddles in the next update. Posts in r/Riddonkulous can also be reported on Reddit.
						</P>
					</Section>
				</div>
			</div>
		</div>
	)
}
