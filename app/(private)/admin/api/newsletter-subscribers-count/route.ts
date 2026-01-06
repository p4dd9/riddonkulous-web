import { requireAdmin } from '@/app/lib/adminAuth'
import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const NEWSLETTER_SUBSCRIBERS_COUNT_API_ENDPOINT = '/api/v1/riddonk/web/moderation/newsletter-subscribers-count'

const getNewsletterSubscribersCountApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${NEWSLETTER_SUBSCRIBERS_COUNT_API_ENDPOINT}`
}

export const GET = async (request: NextRequest) => {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		await requireAdmin(cookieHeader)

		const newsletterSubscribersCountApiUrl = await getNewsletterSubscribersCountApiUrl()

		const response = await fetch(newsletterSubscribersCountApiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to retrieve newsletter subscribers count',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		console.error('Get newsletter subscribers count error:', error)
		return NextResponse.json(
			{ status: 500, message: 'Failed to retrieve newsletter subscribers count' },
			{ status: 500 }
		)
	}
}
