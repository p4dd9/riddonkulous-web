import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Riddle Feed | Riddles with Answers',
	description:
		'All riddles, all answers. Browse brain teasers, logic puzzles, and tricky riddles. New ones added regularly.',
	openGraph: {
		title: 'Riddle Feed | Riddles with Answers',
		description: 'All riddles, all answers. Brain teasers, logic puzzles, and tricky riddles. See how many you can solve.',
		url: 'https://riddonkulous.com/riddle-feed',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Riddle Feed | Riddles with Answers',
		description: 'All riddles, all answers. Brain teasers, logic puzzles, and tricky riddles. See how many you can solve.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/riddle-feed',
	},
}

export default function RiddleFeedLayout({ children }: { children: React.ReactNode }) {
	return children
}
