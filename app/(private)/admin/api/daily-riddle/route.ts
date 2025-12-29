import { requireAdmin } from '@/app/lib/adminAuth'
import { getApiBaseUrl } from '@/app/util/apiConfig'
import { serverLogger } from '@/app/util/logger'
import { NextRequest, NextResponse } from 'next/server'

const DAILY_RIDDLE_API_ENDPOINT = '/api/v1/riddonk/web/daily/riddle'

const getDailyRiddleApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${DAILY_RIDDLE_API_ENDPOINT}`
}

export const POST = async (request: NextRequest) => {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		await requireAdmin(cookieHeader)

		const body = await request.json().catch(() => ({}))
		const dailyRiddleApiUrl = await getDailyRiddleApiUrl()

		const response = await fetch(dailyRiddleApiUrl, {
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
				message: 'Failed to create daily riddle',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()

		return NextResponse.json(data, { status: 201 })
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		serverLogger.error(`Create daily riddle error: ${error instanceof Error ? error.message : String(error)}`)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
