'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdventureRedirectPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchCurrentAdventure = async () => {
			try {
				const response = await fetch('/api/adventure')
				if (!response.ok) {
					throw new Error('Failed to fetch current adventure')
				}
				const data = await response.json()
				if (data.status === 'success' && data.data?.adventure?.adventureNumber) {
					// replace, not push — this is a redirect page. Pushing leaves
					// /riddle/adventure in history, so a native back lands here and
					// this effect immediately re-pushes the view (the "reload/bounce").
					router.replace(`/riddle/adventure/${data.data.adventure.adventureNumber}`)
				} else {
					router.replace('/')
				}
			} catch (error) {
				console.error('Error fetching current adventure:', error)
				router.replace('/')
			} finally {
				setIsLoading(false)
			}
		}

		fetchCurrentAdventure()
	}, [router])

	if (isLoading) {
		return (
			<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
				<p className="text-xl">Loading adventure...</p>
			</div>
		)
	}

	return null
}
