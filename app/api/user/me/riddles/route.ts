import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const USER_RIDDLES_API_ENDPOINT = '/api/v1/riddonk/web/user/me/riddles'

const getUserRiddlesApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${USER_RIDDLES_API_ENDPOINT}`
}

export async function GET(request: NextRequest) {
	try {
		const userRiddlesApiUrl = await getUserRiddlesApiUrl()

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''

		// Get query parameters
		const searchParams = request.nextUrl.searchParams
		const limit = searchParams.get('limit') || '50'
		const offset = searchParams.get('offset') || '0'

		// Build URL with query parameters
		const url = new URL(userRiddlesApiUrl)
		url.searchParams.set('limit', limit)
		url.searchParams.set('offset', offset)

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to fetch user riddles',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Get user riddles error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

