import { requireAdmin } from '@/app/lib/adminAuth'
import { postDailyRiddleToDiscord } from '@/app/services/discordService'
import { DailyRiddleType } from '@/app/schemas/DailyRiddleSchema'
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

/**
 * Get the base URL for the website (for generating riddle links)
 */
const getWebsiteBaseUrl = (request: NextRequest): string => {
	// Try to get from request headers first
	const origin = request.headers.get('origin') || request.headers.get('host')
	if (origin) {
		const protocol = request.headers.get('x-forwarded-proto') || 'https'
		return origin.startsWith('http') ? origin : `${protocol}://${origin}`
	}

	// Fall back to environment variable or default
	return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1/riddonk/web', '') || 'https://riddonkulous.com'
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
		
		// Post to Discord if daily riddle was created successfully
		// Don't fail the request if Discord posting fails
		// The API response structure is: { data: DailyRiddleType, status: string }
		const dailyRiddle = data?.data
		if (dailyRiddle && typeof dailyRiddle === 'object' && 'riddleNumber' in dailyRiddle) {
			try {
				const websiteBaseUrl = getWebsiteBaseUrl(request)
				const discordResult = await postDailyRiddleToDiscord(dailyRiddle as DailyRiddleType, websiteBaseUrl)
				
				if (discordResult.success) {
					serverLogger.info(`Discord notification sent to ${discordResult.channelsPosted} channel(s)`)
				} else {
					serverLogger.warn(`Discord notification failed: ${discordResult.errors.join(', ')}`)
				}
			} catch (discordError) {
				// Log but don't fail the request
				serverLogger.error(`Error posting to Discord: ${discordError}`)
			}
		}

		return NextResponse.json(data, { status: 201 })
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		serverLogger.error('Create daily riddle error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}


