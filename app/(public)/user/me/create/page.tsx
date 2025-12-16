'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { CreateRiddleForm } from '@/app/components/riddles/CreateRiddleForm'
import { useAuth } from '@/app/contexts/AuthContext'

export default function CreatePage() {
	const { user, isLoading } = useAuth()

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	const handleCreateOnReddit = () => {
		window.open('https://www.reddit.com/r/riddonkulous', '_blank', 'noopener,noreferrer')
	}

	return (
		<div className="w-full">
			<div className="bg-[var(--color-bg)] rounded-lg shadow-lg md:p-8">
				<h1 className="text-2xl md:text-3xl mb-6">Create</h1>

				<div className="flex flex-col gap-6">
					{/* Create Riddle Form */}
					<div className="bg-[var(--color-bg)] rounded-lg">
						<CreateRiddleForm />
					</div>

					{/* Alternative: Create on Reddit */}
					<div className="bg-[var(--color-bg)] rounded-lg ">
						<div className="flex items-start gap-4">
							<div className="flex-1">
								<h3 className="text-lg mb-2 text-white">Or Create Riddles on Reddit</h3>
								<p className="text-white/70 mb-4">
									You can also create riddles by visiting our Reddit community at r/riddonkulous.
								</p>
								<BasicButton
									text="Go to Reddit"
									customClass="w-full md:w-auto px-4 py-2"
									threeD={false}
									onClick={handleCreateOnReddit}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
