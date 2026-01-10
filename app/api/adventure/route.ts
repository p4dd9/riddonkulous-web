import { getApiBaseUrl, getApiKey } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const getAdventureApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}/api/v1/riddonk/web/daily/adventure`
}

export async function GET(request: NextRequest) {
	try {
		const adventureApiUrl = await getAdventureApiUrl()
		const apiKey = await getApiKey()

		const response = await fetch(adventureApiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to fetch adventure',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Adventure fetch error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
