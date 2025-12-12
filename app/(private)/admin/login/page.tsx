'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLoginPage() {
	const router = useRouter()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [checkingAuth, setCheckingAuth] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/admin/api/tags?limit=1&offset=0', {
					credentials: 'include',
				})
				if (response.ok) {
					router.push('/admin')
					return
				}
			} catch {
			} finally {
				setCheckingAuth(false)
			}
		}
		checkAuth()
	}, [router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const response = await fetch('/admin/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			})

			const data = await response.json()

			if (data.success) {
				router.push('/admin')
				router.refresh()
			} else {
				setError(data.error || 'Invalid credentials')
			}
		} catch {
			setError('An error occurred. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	if (checkingAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center">Checking authentication...</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
					<h1 className="text-3xl mb-6 text-center">Admin Login</h1>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="username" className="block text-sm  mb-2">
								Username
							</label>
							<input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
								autoComplete="username"
							/>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm  mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
								autoComplete="current-password"
							/>
						</div>
						{error && (
							<div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
								{error}
							</div>
						)}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-primary hover:bg-secondary text-white  py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Logging in...' : 'Login'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
