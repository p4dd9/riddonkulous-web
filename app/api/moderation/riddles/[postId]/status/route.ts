import { requireModerator } from '@/app/lib/moderationAuth'
import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const getModerationApiUrl = async (postId: string): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}/api/v1/riddonk/web/moderation/riddles/${postId}/status`
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
	try {
		// Verify moderator access
		const cookieHeader = request.headers.get('cookie') || ''
		await requireModerator(cookieHeader)

		const { postId } = await params
		const moderationApiUrl = await getModerationApiUrl(postId)
		const body = await request.json()

		const response = await fetch(moderationApiUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to update riddle status',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error: any) {
		if (error.message === 'Moderator access required') {
			return NextResponse.json({ error: 'Forbidden', message: 'Insufficient permissions' }, { status: 403 })
		}
		console.error('Update riddle status error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
