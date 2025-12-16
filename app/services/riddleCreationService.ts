'use client'

export interface RiddleFormData {
	word: string
	riddle: string
	bg: string
	explanation?: string
}

export interface CreateRiddleResponse {
	status: 'success'
	data: {
		postId: string
		status: 'APPROVED' | 'IN_REVIEW'
	}
}

export interface ErrorResponse {
	status: number
	message: string
	details?: Array<{
		path: string[]
		message: string
	}>
}

/**
 * Create a new riddle
 */
export const createRiddle = async (formData: RiddleFormData): Promise<CreateRiddleResponse> => {
	const response = await fetch('/api/riddle/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			word: formData.word.trim(),
			riddle: formData.riddle.trim(),
			bg: formData.bg.trim(),
			explanation: formData.explanation?.trim() || undefined,
		}),
	})

	if (!response.ok) {
		const error: ErrorResponse = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to create riddle',
		}))
		throw error
	}

	return response.json()
}

/**
 * Validate word field
 */
export const validateWord = (word: string): string | null => {
	if (!word.trim()) return 'Word is required'
	if (word.length > 20) return 'Word must be 20 characters or less'
	return null
}

/**
 * Validate riddle field
 */
export const validateRiddle = (riddle: string): string | null => {
	if (!riddle.trim()) return 'Riddle is required'
	if (riddle.length < 50) return 'Riddle must be at least 50 characters'
	if (riddle.length > 750) return 'Riddle must be 750 characters or less'
	return null
}

/**
 * Validate bg field (must be a selected canvas SKU)
 */
export const validateBg = (bg: string): string | null => {
	if (!bg.trim()) return 'Background is required'
	return null
}

/**
 * Validate explanation field
 */
export const validateExplanation = (explanation: string): string | null => {
	if (explanation.length > 1000) return 'Explanation must be 1000 characters or less'
	return null
}
