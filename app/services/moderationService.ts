'use client'

export interface Riddle {
	postId: string
	type?: string
	author?: string
	userid: string
	word: string
	riddle: string
	bg?: string
	explanation?: string
	status: 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'REMOVED'
	score: number
	tags: string[]
	createdAt: string
	updatedAt: string
}

export interface GetRiddlesResponse {
	status: 'success'
	data: {
		riddles: Riddle[]
		total: number
		limit: number
		offset: number
	}
}

export interface UpdateStatusRequest {
	status: 'APPROVED' | 'REJECTED' | 'REMOVED'
}

export interface UpdateStatusResponse {
	status: 'success'
	message: string
	data: {
		riddle: Riddle
	}
}

export interface ModerationStats {
	IN_REVIEW: number
	APPROVED: number
	REJECTED: number
	REMOVED: number
	total: number
}

export interface StatsResponse {
	status: 'success'
	data: ModerationStats
}

export interface ErrorResponse {
	status: number
	message: string
	error?: string
	details?: Array<{
		path: string[]
		message: string
	}>
}

/**
 * Get riddles for moderation review
 */
export const getModerationRiddles = async (
	status?: 'IN_REVIEW' | 'REJECTED' | 'REMOVED',
	limit: number = 50,
	offset: number = 0
): Promise<GetRiddlesResponse> => {
	const params = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
	})
	if (status) {
		params.append('status', status)
	}

	const response = await fetch(`/api/moderation/riddles?${params}`, {
		credentials: 'include',
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to fetch riddles',
		}))
		throw error
	}

	return response.json()
}

/**
 * Update riddle status
 */
export const updateRiddleStatus = async (
	postId: string,
	status: 'APPROVED' | 'REJECTED' | 'REMOVED'
): Promise<UpdateStatusResponse> => {
	const response = await fetch(`/api/moderation/riddles/${postId}/status`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ status }),
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to update riddle status',
		}))
		throw error
	}

	return response.json()
}

/**
 * Get moderation statistics
 */
export const getModerationStats = async (): Promise<StatsResponse> => {
	const response = await fetch('/api/moderation/stats', {
		credentials: 'include',
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to fetch moderation statistics',
		}))
		throw error
	}

	return response.json()
}

