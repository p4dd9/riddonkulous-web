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
					router.push(`/riddle/adventure/${data.data.adventure.adventureNumber}`)
				} else {
					router.push('/')
				}
			} catch (error) {
				console.error('Error fetching current adventure:', error)
				router.push('/')
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
