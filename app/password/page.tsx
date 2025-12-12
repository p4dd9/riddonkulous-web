'use client'

import { BasicButton } from '@/app/components/buttons/BasicButton'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PasswordPage() {
	const router = useRouter()
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const response = await fetch('/api/public-auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			})

			const data = await response.json()

			if (data.success) {
				router.refresh()
				router.push('/')
			} else {
				setError(data.error || 'Invalid password')
			}
		} catch (err) {
			setError('An error occurred. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="relative h-full min-h-screen w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-8">
			<div className="w-full max-w-md flex flex-col gap-6">
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-bold mb-2">Riddonkulous</h1>
					<p className="text-gray-400">This platform is not yet ready for public release.</p>
					<p className="text-gray-400 mt-2">Please enter the password to continue.</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="password" className="text-lg ">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							className="w-full px-4 py-3 rounded-md border-2 border-gray-300 bg-transparent text-white focus:border-primary focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
							placeholder="Enter password"
							autoFocus
						/>
						{error && <p className="text-red-500 text-sm">{error}</p>}
					</div>

					<BasicButton
						text={loading ? 'Verifying...' : 'Enter'}
						onClick={handleSubmit}
						customClass="w-full py-3"
						disabled={loading || !password.trim()}
					/>
				</form>
			</div>
		</div>
	)
}
