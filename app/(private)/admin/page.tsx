'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Tag {
	id: string
	label: string
	description?: string
	asset_name_path?: string
	order?: number
}

interface TagListResponse {
	tags: Tag[]
	total: number
}

export default function AdminDashboard() {
	const router = useRouter()
	const [tags, setTags] = useState<Tag[]>([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [limit] = useState(50)
	const [offset, setOffset] = useState(0)

	// Form state
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [editingTag, setEditingTag] = useState<Tag | null>(null)
	const [formId, setFormId] = useState('')
	const [formLabel, setFormLabel] = useState('')
	const [formDescription, setFormDescription] = useState('')
	const [formAssetNamePath, setFormAssetNamePath] = useState('')
	const [formOrder, setFormOrder] = useState<string>('')
	const [formLoading, setFormLoading] = useState(false)

	const fetchTags = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await fetch(`/admin/api/tags?limit=${limit}&offset=${offset}`)
			if (!response.ok) {
				if (response.status === 401) {
					router.push('/admin/login')
					return
				}
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.error || 'Failed to fetch tags')
			}
			const data: TagListResponse = await response.json()
			setTags(data.tags || [])
			setTotal(data.total || 0)
		} catch (err: any) {
			setError(err.message || 'Failed to load tags')
			setTags([])
			setTotal(0)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchTags()
	}, [offset])

	const handleLogout = async () => {
		await fetch('/admin/api/logout', { method: 'POST' })
		router.push('/admin/login')
		router.refresh()
	}

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault()
		setFormLoading(true)
		setError('')

		try {
			const response = await fetch('/admin/api/tags', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: formId,
					label: formLabel,
					description: formDescription || undefined,
					asset_name_path: formAssetNamePath || undefined,
					order: formOrder ? parseInt(formOrder, 10) : undefined,
				}),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Failed to create tag')
			}

			setShowCreateForm(false)
			setFormId('')
			setFormLabel('')
			setFormDescription('')
			setFormAssetNamePath('')
			setFormOrder('')
			fetchTags()
		} catch (err: any) {
			setError(err.message || 'Failed to create tag')
		} finally {
			setFormLoading(false)
		}
	}

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!editingTag) return

		setFormLoading(true)
		setError('')

		try {
			const response = await fetch(`/admin/api/tags/${editingTag.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					label: formLabel,
					description: formDescription || undefined,
					asset_name_path: formAssetNamePath || undefined,
					order: formOrder ? parseInt(formOrder, 10) : undefined,
				}),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Failed to update tag')
			}

			setEditingTag(null)
			setFormLabel('')
			setFormDescription('')
			setFormAssetNamePath('')
			setFormOrder('')
			fetchTags()
		} catch (err: any) {
			setError(err.message || 'Failed to update tag')
		} finally {
			setFormLoading(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm(`Are you sure you want to delete tag "${id}"?`)) {
			return
		}

		setError('')
		try {
			const response = await fetch(`/admin/api/tags/${id}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Failed to delete tag')
			}

			fetchTags()
		} catch (err: any) {
			setError(err.message || 'Failed to delete tag')
		}
	}

	const startEdit = (tag: Tag) => {
		setEditingTag(tag)
		setFormLabel(tag.label)
		setFormDescription(tag.description || '')
		setFormAssetNamePath(tag.asset_name_path || '')
		setFormOrder(tag.order?.toString() || '')
		setShowCreateForm(false)
	}

	const cancelEdit = () => {
		setEditingTag(null)
		setFormLabel('')
		setFormDescription('')
		setFormAssetNamePath('')
		setFormOrder('')
		setShowCreateForm(false)
		setFormId('')
	}

	return (
		<div className="min-h-screen w-full max-w-6xl mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl ">Admin Dashboard - Tag Management</h1>
				<button
					onClick={handleLogout}
					className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
				>
					Logout
				</button>
			</div>

			{error && (
				<div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4">
					{error}
				</div>
			)}

			<div className="mb-6">
				{!showCreateForm && !editingTag && (
					<button
						onClick={() => {
							setShowCreateForm(true)
							setEditingTag(null)
							setFormId('')
							setFormLabel('')
							setFormDescription('')
							setFormAssetNamePath('')
							setFormOrder('')
						}}
						className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md transition-colors"
					>
						Create New Tag
					</button>
				)}

				{(showCreateForm || editingTag) && (
					<div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
						<h2 className="text-xl mb-4">{editingTag ? 'Edit Tag' : 'Create New Tag'}</h2>
						<form onSubmit={editingTag ? handleUpdate : handleCreate} className="space-y-4">
							{!editingTag && (
								<div>
									<label htmlFor="formId" className="block text-sm font-medium mb-2">
										Tag ID
									</label>
									<input
										id="formId"
										type="text"
										value={formId}
										onChange={(e) => setFormId(e.target.value)}
										required
										className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="e.g., classic"
									/>
								</div>
							)}
							<div>
								<label htmlFor="formLabel" className="block text-sm font-medium mb-2">
									Tag Label
								</label>
								<input
									id="formLabel"
									type="text"
									value={formLabel}
									onChange={(e) => setFormLabel(e.target.value)}
									required
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="e.g., Classic"
								/>
							</div>
							<div>
								<label htmlFor="formDescription" className="block text-sm font-medium mb-2">
									Description (optional)
								</label>
								<textarea
									id="formDescription"
									value={formDescription}
									onChange={(e) => setFormDescription(e.target.value)}
									rows={3}
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
									placeholder="e.g., Classic riddles that are timeless"
								/>
							</div>
							<div>
								<label htmlFor="formAssetNamePath" className="block text-sm font-medium mb-2">
									Asset Name Path (optional)
								</label>
								<input
									id="formAssetNamePath"
									type="text"
									value={formAssetNamePath}
									onChange={(e) => setFormAssetNamePath(e.target.value)}
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="e.g., /canvas/BG029.gif"
								/>
							</div>
							<div>
								<label htmlFor="formOrder" className="block text-sm font-medium mb-2">
									Order (optional)
								</label>
								<input
									id="formOrder"
									type="number"
									value={formOrder}
									onChange={(e) => setFormOrder(e.target.value)}
									className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="e.g., 1"
								/>
								<p className="text-xs text-gray-400 mt-1">
									Lower numbers appear first. Tags without order appear at the end.
								</p>
							</div>
							<div className="flex gap-2">
								<button
									type="submit"
									disabled={formLoading}
									className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
								>
									{formLoading ? 'Saving...' : editingTag ? 'Update' : 'Create'}
								</button>
								<button
									type="button"
									onClick={cancelEdit}
									className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}
			</div>

			<div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
				<div className="p-4 border-b border-gray-700">
					<h2 className="text-xl">Tags ({total})</h2>
				</div>

				{loading ? (
					<div className="p-8 text-center">Loading tags...</div>
				) : !tags || tags.length === 0 ? (
					<div className="p-8 text-center text-gray-400">No tags found</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-900">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Label
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Asset Path
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
										Order
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{tags.map((tag) => (
									<tr key={tag.id} className="hover:bg-gray-750">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tag.id}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm">{tag.label}</td>
										<td className="px-6 py-4 text-sm text-gray-400">{tag.description || '-'}</td>
										<td className="px-6 py-4 text-sm text-gray-400">
											{tag.asset_name_path || '-'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
											{tag.order ?? '-'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => startEdit(tag)}
													className="text-primary hover:text-secondary transition-colors"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(tag.id)}
													className="text-red-400 hover:text-red-300 transition-colors"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{total > limit && (
					<div className="p-4 border-t border-gray-700 flex justify-between items-center">
						<button
							onClick={() => setOffset(Math.max(0, offset - limit))}
							disabled={offset === 0}
							className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<span className="text-sm text-gray-400">
							Showing {offset + 1}-{Math.min(offset + limit, total)} of {total}
						</span>
						<button
							onClick={() => setOffset(offset + limit)}
							disabled={offset + limit >= total}
							className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
