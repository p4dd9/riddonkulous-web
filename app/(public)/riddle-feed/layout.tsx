import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Riddle Feed | Browse All Riddles',
	description:
		'Browse and explore all riddles on Riddonkulous. Discover new puzzles, challenge yourself, and join our community of riddle enthusiasts.',
	openGraph: {
		title: 'Riddle Feed | Browse All Riddles | Riddonkulous',
		description: 'Browse and explore all riddles on Riddonkulous. Discover new puzzles and challenge yourself.',
		url: 'https://riddonkulous.com/riddle-feed',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Riddle Feed | Browse All Riddles | Riddonkulous',
		description: 'Browse and explore all riddles on Riddonkulous.',
	},
	alternates: {
		canonical: 'https://riddonkulous.com/riddle-feed',
	},
}

export default function RiddleFeedLayout({ children }: { children: React.ReactNode }) {
	return children
}
