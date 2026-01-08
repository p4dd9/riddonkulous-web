'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import {
	deleteRiddle,
	getModerationRiddles,
	getModerationStats,
	updateRiddleStatus,
	type ModerationStats,
	type Riddle,
} from '@/app/services/moderationService'
import { getCanvasBackground } from '@/app/util/cosmetics'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ModerationPage() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useAuth()
	const [riddles, setRiddles] = useState<Riddle[]>([])
	const [stats, setStats] = useState<ModerationStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [statusFilter, setStatusFilter] = useState<'IN_REVIEW' | 'REJECTED' | 'REMOVED' | undefined>('IN_REVIEW')
	const [currentPage, setCurrentPage] = useState(0)
	const [total, setTotal] = useState(0)
	const [updatingPostId, setUpdatingPostId] = useState<string | null>(null)
	const limit = 20

	// Check if user is moderator/admin
	useEffect(() => {
		if (!authLoading && user) {
			if (user.role !== 'moderator' && user.role !== 'admin') {
				router.push('/403')
				return
			}
		}
	}, [user, authLoading, router])

	const fetchRiddles = async () => {
		setLoading(true)
		setError('')
		try {
			const data = await getModerationRiddles(statusFilter, limit, currentPage * limit)
			setRiddles(data.data.riddles)
			setTotal(data.data.total)
		} catch (err: any) {
			if (err.status === 401 || err.status === 403) {
				setError('Unauthorized - Please log in as moderator')
				router.push('/admin/login')
			} else {
				setError(err.message || 'Failed to fetch riddles')
			}
			setRiddles([])
			setTotal(0)
		} finally {
			setLoading(false)
		}
	}

	const fetchStats = async () => {
		try {
			const data = await getModerationStats()
			setStats(data.data)
		} catch (err: any) {
			console.error('Failed to fetch stats:', err)
		}
	}

	useEffect(() => {
		if (user && (user.role === 'moderator' || user.role === 'admin')) {
			fetchRiddles()
			fetchStats()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, statusFilter])

	const handleApprove = async (postId: string) => {
		setUpdatingPostId(postId)
		try {
			await updateRiddleStatus(postId, 'APPROVED')
			await fetchRiddles()
			await fetchStats()
		} catch (err: any) {
			alert(err.message || 'Failed to approve riddle')
		} finally {
			setUpdatingPostId(null)
		}
	}

	const handleReject = async (postId: string) => {
		if (!confirm('Are you sure you want to reject this riddle?')) {
			return
		}
		setUpdatingPostId(postId)
		try {
			await updateRiddleStatus(postId, 'REJECTED')
			await fetchRiddles()
			await fetchStats()
		} catch (err: any) {
			alert(err.message || 'Failed to reject riddle')
		} finally {
			setUpdatingPostId(null)
		}
	}

	const handleRemove = async (postId: string) => {
		if (!confirm('Are you sure you want to remove this riddle? This action cannot be undone.')) {
			return
		}
		setUpdatingPostId(postId)
		try {
			await updateRiddleStatus(postId, 'REMOVED')
			await fetchRiddles()
			await fetchStats()
		} catch (err: any) {
			alert(err.message || 'Failed to remove riddle')
		} finally {
			setUpdatingPostId(null)
		}
	}

	const handleDelete = async (postId: string) => {
		if (!confirm('Are you sure you want to permanently delete this riddle? This action cannot be undone.')) {
			return
		}
		setUpdatingPostId(postId)
		try {
			await deleteRiddle(postId)
			await fetchRiddles()
			await fetchStats()
		} catch (err: any) {
			alert(err.message || 'Failed to delete riddle')
		} finally {
			setUpdatingPostId(null)
		}
	}

	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case 'IN_REVIEW':
				return 'bg-yellow-900/50 text-yellow-300 border-yellow-700'
			case 'APPROVED':
				return 'bg-green-900/50 text-green-300 border-green-700'
			case 'REJECTED':
				return 'bg-red-900/50 text-red-300 border-red-700'
			case 'REMOVED':
				return 'bg-gray-700 text-gray-300 border-gray-600'
			default:
				return 'bg-gray-700 text-gray-300 border-gray-600'
		}
	}

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center">Loading...</div>
			</div>
		)
	}

	if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
		return null
	}

	return (
		<div className="min-h-screen w-full max-w-6xl mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl">Moderation Queue</h1>
				<button
					onClick={() => router.push('/admin')}
					className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
				>
					Back to Admin
				</button>
			</div>

			{error && (
				<div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4">
					{error}
				</div>
			)}

			{/* Statistics Dashboard */}
			{stats && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
						<h3 className="text-sm text-gray-400 mb-1">Pending Review</h3>
						<p className="text-2xl text-yellow-400">{stats.IN_REVIEW}</p>
					</div>
					<div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
						<h3 className="text-sm text-gray-400 mb-1">Approved</h3>
						<p className="text-2xl text-green-400">{stats.APPROVED}</p>
					</div>
					<div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
						<h3 className="text-sm text-gray-400 mb-1">Rejected</h3>
						<p className="text-2xl text-red-400">{stats.REJECTED}</p>
					</div>
					<div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
						<h3 className="text-sm text-gray-400 mb-1">Removed</h3>
						<p className="text-2xl text-gray-400">{stats.REMOVED}</p>
					</div>
				</div>
			)}

			{/* Status Filter */}
			<div className="flex gap-2 mb-6">
				<button
					onClick={() => {
						setStatusFilter('IN_REVIEW')
						setCurrentPage(0)
					}}
					className={`px-4 py-2 rounded-md transition-colors ${
						statusFilter === 'IN_REVIEW'
							? 'bg-primary text-white'
							: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
					}`}
				>
					Pending Review ({stats?.IN_REVIEW || 0})
				</button>
				<button
					onClick={() => {
						setStatusFilter('REJECTED')
						setCurrentPage(0)
					}}
					className={`px-4 py-2 rounded-md transition-colors ${
						statusFilter === 'REJECTED'
							? 'bg-primary text-white'
							: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
					}`}
				>
					Rejected ({stats?.REJECTED || 0})
				</button>
				<button
					onClick={() => {
						setStatusFilter('REMOVED')
						setCurrentPage(0)
					}}
					className={`px-4 py-2 rounded-md transition-colors ${
						statusFilter === 'REMOVED'
							? 'bg-primary text-white'
							: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
					}`}
				>
					Removed ({stats?.REMOVED || 0})
				</button>
			</div>

			{/* Riddles List */}
			<div className="space-y-4">
				{riddles.length === 0 ? (
					<div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
						No riddles found for this status.
					</div>
				) : (
					riddles.map((riddle) => (
						<div key={riddle.postId} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-xl">Word: {riddle.word}</h3>
										<span
											className={`px-2 py-1 rounded text-xs border ${getStatusBadgeClass(riddle.status)}`}
										>
											{riddle.status}
										</span>
									</div>
									<div className="text-sm text-gray-400 mb-2">
										<span>ID: {riddle.postId}</span>
										<span className="mx-2">•</span>
										<span>Author: {riddle.author || 'Unknown'}</span>
										<span className="mx-2">•</span>
										<span>Created: {new Date(riddle.createdAt).toLocaleDateString()}</span>
									</div>
								</div>
							</div>

							{riddle.bg && (
								<div className="mb-4">
									<Image
										src={getCanvasBackground(riddle.bg)}
										alt="Background"
										width={200}
										height={150}
										className="rounded-md object-cover"
									/>
								</div>
							)}

							<div className="mb-4">
								<p className="text-gray-300 whitespace-pre-wrap">{riddle.riddle}</p>
							</div>

							{riddle.explanation && (
								<div className="mb-4 p-3 bg-gray-700/50 rounded-md">
									<p className="text-sm text-gray-400 mb-1">Explanation:</p>
									<p className="text-gray-300 text-sm">{riddle.explanation}</p>
								</div>
							)}

							{riddle.tags && riddle.tags.length > 0 && (
								<div className="mb-4 flex flex-wrap gap-2">
									{riddle.tags.map((tag) => (
										<span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
											{tag}
										</span>
									))}
								</div>
							)}

							<div className="flex gap-2 pt-4 border-t border-gray-700">
								{riddle.status === 'IN_REVIEW' && (
									<>
										<button
											onClick={() => handleApprove(riddle.postId)}
											disabled={updatingPostId === riddle.postId}
											className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{updatingPostId === riddle.postId ? 'Updating...' : 'Approve'}
										</button>
										<button
											onClick={() => handleReject(riddle.postId)}
											disabled={updatingPostId === riddle.postId}
											className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{updatingPostId === riddle.postId ? 'Updating...' : 'Reject'}
										</button>
									</>
								)}
								{riddle.status === 'APPROVED' && (
									<button
										onClick={() => handleRemove(riddle.postId)}
										disabled={updatingPostId === riddle.postId}
										className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{updatingPostId === riddle.postId ? 'Updating...' : 'Remove'}
									</button>
								)}
								<button
									onClick={() => handleDelete(riddle.postId)}
									disabled={updatingPostId === riddle.postId}
									className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{updatingPostId === riddle.postId ? 'Deleting...' : 'Delete'}
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination */}
			{total > limit && (
				<div className="mt-6 flex justify-between items-center">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
						disabled={currentPage === 0}
						className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Back
					</button>
					<span className="text-sm text-gray-400">
						Page {currentPage + 1} of {Math.ceil(total / limit)} ({total} total)
					</span>
					<button
						onClick={() => setCurrentPage((prev) => prev + 1)}
						disabled={(currentPage + 1) * limit >= total}
						className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			)}
		</div>
	)
}
