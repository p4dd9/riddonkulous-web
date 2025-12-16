'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { CreateRiddleForm } from '@/app/components/riddles/CreateRiddleForm'
import { useAuth } from '@/app/contexts/AuthContext'
import Image from 'next/image'

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
			<div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 border border-gray-700">
				<h1 className="text-2xl md:text-3xl mb-6">Create</h1>

				<div className="flex flex-col gap-6">
					{/* Create Riddle Form */}
					<div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
						<h2 className="text-xl mb-4">Create a New Riddle</h2>
						<CreateRiddleForm />
					</div>

					{/* Alternative: Create on Reddit */}
					<div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
						<div className="flex items-start gap-4 mb-4">
							<Image
								src="/icons/pencil.png"
								alt="Create"
								width={32}
								height={32}
								className="w-8 h-8 flex-shrink-0"
							/>
							<div className="flex-1">
								<h3 className="text-lg mb-2">Or Create Riddles on Reddit</h3>
								<p className="text-gray-300 mb-4">
									You can also create riddles by visiting our Reddit community at r/riddonkulous.
									Share your riddles with the community and they may be featured on the website!
								</p>
								<BasicButton
									text="Go to Reddit"
									customClass="w-full md:w-auto"
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
