import { getApiBaseUrl, getApiKey } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const getRecommendationsApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}/api/v1/riddonk/web/daily/adventure/recommendations`
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { solvedPostIds, limit = 10 } = body

		if (!Array.isArray(solvedPostIds)) {
			return NextResponse.json({ error: 'solvedPostIds must be an array' }, { status: 400 })
		}

		if (solvedPostIds.length === 0) {
			return NextResponse.json({ error: 'solvedPostIds cannot be empty' }, { status: 400 })
		}

		const recommendationsApiUrl = await getRecommendationsApiUrl()
		const apiKey = await getApiKey()

		const response = await fetch(recommendationsApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				solvedPostIds,
				limit: Math.min(Math.max(limit, 1), 50), // Clamp between 1-50
			}),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to fetch recommendations',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Recommendations fetch error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
