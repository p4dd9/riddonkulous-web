'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { unsubscribeFromNewsletter } from '@/app/services/userService'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UnsubscribePage() {
	const { user, isLoading } = useAuth()
	const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'not-authenticated'>('loading')
	const [message, setMessage] = useState('')

	useEffect(() => {
		const handleUnsubscribe = async () => {
			if (isLoading) return

			if (!user) {
				setStatus('not-authenticated')
				setMessage('You must be logged in to unsubscribe from the newsletter.')
				return
			}

			try {
				const response = await unsubscribeFromNewsletter()
				if (response.status === 'success') {
					setStatus('success')
					setMessage('Successfully unsubscribed from the weekly newsletter.')
				} else {
					setStatus('error')
					setMessage('Failed to unsubscribe. Please try again.')
				}
			} catch (error: any) {
				setStatus('error')
				setMessage(error.message || 'Failed to unsubscribe. Please try again.')
			}
		}

		handleUnsubscribe()
	}, [user, isLoading])

	return (
		<div className="w-full max-w-2xl mx-auto px-4 py-8">
			<div className="bg-[var(--color-bg)] rounded-lg shadow-lg p-8">
				<h1 className="text-2xl md:text-3xl mb-6">Newsletter Unsubscription</h1>

				{status === 'loading' && (
					<div className="text-center py-8">
						<p className="text-white/60">Processing your unsubscription...</p>
					</div>
				)}

				{status === 'not-authenticated' && (
					<div className="space-y-4">
						<p className="text-white/80">{message}</p>
						<div className="flex gap-4">
							<Link href="/" className="flex-1">
								<BasicButton text="Go to Home" customClass="w-full" threeD={false} />
							</Link>
						</div>
					</div>
				)}

				{status === 'success' && (
					<div className="space-y-4">
						<p className="text-green-400 text-lg">{message}</p>
						<p className="text-white/60">
							You will no longer receive our weekly newsletter. You can resubscribe at any time from your
							profile settings.
						</p>
						<div className="flex gap-4">
							<Link href="/user/me" className="flex-1">
								<BasicButton text="Manage Subscription" customClass="w-full" threeD={false} />
							</Link>
							<Link href="/" className="flex-1">
								<BasicButton
									text="Go to Home"
									customClass="w-full bg-[var(--color-bg)] border-2 border-primary"
									threeD={false}
								/>
							</Link>
						</div>
					</div>
				)}

				{status === 'error' && (
					<div className="space-y-4">
						<p className="text-red-400 text-lg">{message}</p>
						<div className="flex gap-4">
							<Link href="/user/me" className="flex-1">
								<BasicButton text="Go to Profile" customClass="w-full" threeD={false} />
							</Link>
							<Link href="/" className="flex-1">
								<BasicButton
									text="Go to Home"
									customClass="w-full bg-[var(--color-bg)] border-2 border-primary"
									threeD={false}
								/>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
