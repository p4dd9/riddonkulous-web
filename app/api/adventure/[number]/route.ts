import { getApiBaseUrl, getApiKey } from '@/app/util/apiConfig'
import { stripSolutions } from '@/app/util/stripSolution'
import { NextRequest, NextResponse } from 'next/server'

const getAdventureApiUrl = async (number: number): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}/api/v1/riddonk/web/daily/adventure/${number}`
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ number: string }> }) {
	try {
		const { number } = await params
		const adventureNumber = parseInt(number, 10)

		if (isNaN(adventureNumber) || adventureNumber < 1) {
			return NextResponse.json({ error: 'Invalid adventure number' }, { status: 400 })
		}

		const adventureApiUrl = await getAdventureApiUrl(adventureNumber)
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

		// Strip solution data from riddles before sending to client
		if (data?.data?.riddles) {
			data.data.riddles = stripSolutions(data.data.riddles, true)
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Adventure fetch error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
