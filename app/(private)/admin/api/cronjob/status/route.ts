import { requireAdmin } from '@/app/lib/adminAuth'
import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const CRONJOB_STATUS_API_ENDPOINT = '/api/v1/riddonk/web/moderation/cronjob/status'

const getCronjobStatusApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${CRONJOB_STATUS_API_ENDPOINT}`
}

export const GET = async (request: NextRequest) => {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		await requireAdmin(cookieHeader)

		const cronjobStatusApiUrl = await getCronjobStatusApiUrl()

		const response = await fetch(cronjobStatusApiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to retrieve cronjob status',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		console.error('Get cronjob status error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}


