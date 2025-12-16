'use client'

import { useAuth } from '@/app/contexts/AuthContext'

export default function RiddlesPage() {
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

	return (
		<div className="w-full">
			<div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 border border-gray-700">
				<h1 className="text-2xl md:text-3xl mb-6">My Riddles</h1>

				<div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
					<p className="text-gray-300 text-center py-8">
						Your riddles will appear here once you create them on Reddit and they are featured on the website.
					</p>
				</div>
			</div>
		</div>
	)
}


