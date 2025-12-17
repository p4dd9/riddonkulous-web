import { RiddleCard } from '@/app/components/riddles/RiddleCard'
import { StructuredData } from '@/app/components/seo/StructuredData'
import type { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
import { getUserProfileByUsername } from '@/app/services/userProfileService'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface UserProfilePageProps {
	params: Promise<{
		username: string
	}>
}

export const revalidate = 120 // 2 minutes

export const generateMetadata = async ({ params }: UserProfilePageProps): Promise<Metadata> => {
	const { username } = await params

	try {
		const profile = await getUserProfileByUsername(username)

		const title = `${profile.username}'s Profile | Riddonkulous`
		const description = `Check out ${profile.username}'s riddles on Riddonkulous. Joined ${new Date(profile.joinedDate).toLocaleDateString()} and created ${profile.riddles.length} riddle${profile.riddles.length !== 1 ? 's' : ''}.`
		const url = `https://riddonkulous.com/profile/${username}`

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				type: 'profile',
				url,
				images: [
					{
						url: '/web-app-manifest-512x512.png',
						width: 512,
						height: 512,
						alt: `${profile.username}'s profile`,
					},
				],
			},
			twitter: {
				card: 'summary',
				title,
				description,
				images: ['/web-app-manifest-512x512.png'],
			},
			alternates: {
				canonical: url,
			},
		}
	} catch {
		return {
			title: 'User Not Found | Riddonkulous',
			description: 'The requested user profile could not be found.',
		}
	}
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
	const { username } = await params

	let profile
	try {
		profile = await getUserProfileByUsername(username)
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
			notFound()
		}
		throw error
	}

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		mainEntity: {
			'@type': 'Person',
			name: profile.username,
			identifier: profile.username,
			description: `Riddonkulous user since ${new Date(profile.joinedDate).toLocaleDateString()}`,
		},
		dateCreated: profile.joinedDate,
		about: {
			'@type': 'ItemList',
			itemListElement: profile.riddles.map((riddle, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Question',
					name: riddle.riddle.substring(0, 100),
					text: riddle.riddle,
					acceptedAnswer: {
						'@type': 'Answer',
						text: riddle.word,
					},
				},
			})),
		},
	}

	// Convert profile riddles to DailyRiddleType format for RiddleCard
	const riddlesForDisplay: DailyRiddleType[] = profile.riddles.map((riddle) => ({
		riddleNumber: 0,
		featuredDate: new Date(),
		postId: riddle.postId,
		type: null,
		author: profile.username,
		authorAvatar: profile.avatar,
		authorSnoo: null,
		solverSnooAvatars: null,
		userId: null,
		date: new Date(riddle.createdAt).getTime().toString(),
		word: riddle.word,
		altwords: null,
		riddle: riddle.riddle,
		bg: 'bg1.png',
		workshopFont: null,
		authorEnabledHints: null,
		feedbackCommentEnabled: null,
		subreddit: null,
		postType: null,
		score: null,
		popularity: 0,
		solved: null,
		guessCount: '0',
		guessCorrectlyCount: null,
		giveUpCount: null,
		title: null,
		context: null,
		userid: null,
		subredditId: null,
	}))

	const avatarUrl = profile.avatar ? `/avatars/${profile.avatar}` : '/avatars/avatar_02.png'

	return (
		<>
			<StructuredData data={structuredData} />
			<div className="relative min-h-screen w-full flex flex-col items-center max-w-6xl mx-auto px-4 py-8">
				<div className="w-full bg-[var(--color-bg)] rounded-lg shadow-lg py-4">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
						<div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary flex-shrink-0">
							<Image
								src={avatarUrl}
								alt={`${profile.username}'s avatar`}
								fill
								className="object-cover"
								priority
							/>
						</div>
						<div className="flex-1 text-center md:text-left">
							<h1 className="text-3xl md:text-4xl mb-4">{profile.username}</h1>
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-2 justify-center md:justify-start">
									<span className="text-white/60">Joined:</span>
									<span className="text-white">
										{new Date(profile.joinedDate).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</span>
								</div>
								<div className="flex items-center gap-2 justify-center md:justify-start">
									<span className="text-white/60">Total Riddles:</span>
									<span className="text-white">{profile.riddles.length}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{profile.riddles.length > 0 ? (
					<div className="w-full">
						<h2 className="text-2xl mb-4">Latest Riddles</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{riddlesForDisplay.map((riddle) => (
								<RiddleCard key={riddle.postId} riddle={riddle} variant="default" />
							))}
						</div>
					</div>
				) : (
					<div className="w-full bg-[var(--color-bg)] rounded-lg shadow-lg p-8 text-center">
						<p className="text-white/60 text-lg">This user hasn&apos;t created any riddles yet.</p>
					</div>
				)}
			</div>
		</>
	)
}
