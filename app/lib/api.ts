'use client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_REDDICORE_API_BASE_URL || ''

/**
 * Get the API base URL
 */
const getApiBaseUrl = (): string => {
	if (!API_URL) {
		throw new Error('NEXT_PUBLIC_API_URL or NEXT_PUBLIC_REDDICORE_API_BASE_URL must be set')
	}

	// Extract base URL
	try {
		const urlObj = new URL(API_URL)
		return `${urlObj.protocol}//${urlObj.host}`
	} catch {
		// If API_URL is already a full URL, use it directly
		return API_URL
	}
}

/**
 * Make an authenticated API request with credentials
 */
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
	const baseUrl = getApiBaseUrl()
	const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`

	return fetch(url, {
		...options,
		credentials: 'include', // Important: sends cookies
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	})
}

/**
 * Create a riddle (authenticated endpoint - requires user to be logged in)
 * Note: Backend should verify user authentication via session cookie
 */
export interface CreateRiddleData {
	word: string
	riddle: string
	altwords?: string | null
	bg?: string | null
	workshopFont?: string | null
	authorEnabledHints?: string | null
	feedbackCommentEnabled?: string | null
	subreddit?: string | null
	postType?: string | null
	title?: string | null
	context?: string | null
}

export interface CreateRiddleResponse {
	status: string
	data: {
		riddle: unknown
	}
}

export const createRiddle = async (riddleData: CreateRiddleData): Promise<CreateRiddleResponse> => {
	const response = await authenticatedFetch('/api/v1/riddonkulous/ai', {
		method: 'POST',
		body: JSON.stringify(riddleData),
	})

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			status: response.status,
			message: 'Failed to create riddle',
		}))
		throw new Error(error.message || 'Failed to create riddle')
	}

	return response.json()
}

