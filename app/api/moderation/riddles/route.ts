import { getApiBaseUrl } from '@/app/util/apiConfig'
import { requireModerator } from '@/app/lib/moderationAuth'
import { NextRequest, NextResponse } from 'next/server'

const MODERATION_API_ENDPOINT = '/api/v1/riddonk/web/moderation/riddles'

const getModerationApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${MODERATION_API_ENDPOINT}`
}

export async function GET(request: NextRequest) {
	try {
		// Verify moderator access
		const cookieHeader = request.headers.get('cookie') || ''
		await requireModerator(cookieHeader)

		const moderationApiUrl = await getModerationApiUrl()
		const searchParams = request.nextUrl.searchParams
		const queryString = searchParams.toString()
		const url = queryString ? `${moderationApiUrl}?${queryString}` : moderationApiUrl

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to fetch riddles for review',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error: any) {
		if (error.message === 'Moderator access required') {
			return NextResponse.json({ error: 'Forbidden', message: 'Insufficient permissions' }, { status: 403 })
		}
		console.error('Get moderation riddles error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

