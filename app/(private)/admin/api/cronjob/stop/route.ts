import { requireAdmin } from '@/app/lib/adminAuth'
import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const CRONJOB_STOP_API_ENDPOINT = '/api/v1/riddonk/web/moderation/cronjob/stop'

const getCronjobStopApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${CRONJOB_STOP_API_ENDPOINT}`
}

export const POST = async (request: NextRequest) => {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		await requireAdmin(cookieHeader)

		const cronjobStopApiUrl = await getCronjobStopApiUrl()

		const response = await fetch(cronjobStopApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to stop cronjob',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		console.error('Stop cronjob error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

