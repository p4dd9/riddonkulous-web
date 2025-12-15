import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const apiBaseUrl = await getApiBaseUrl()
		const authApiUrl = `${apiBaseUrl}/auth/me`

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''

		const response = await fetch(authApiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Get current user error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
