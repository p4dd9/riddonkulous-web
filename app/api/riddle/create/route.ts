import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const RIDDLE_API_ENDPOINT = '/api/v1/riddonk/web/riddle/create'

const getRiddleApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${RIDDLE_API_ENDPOINT}`
}

export async function POST(request: NextRequest) {
	try {
		const riddleApiUrl = await getRiddleApiUrl()

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''
		const body = await request.json()

		const response = await fetch(riddleApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to create riddle',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Create riddle error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}


