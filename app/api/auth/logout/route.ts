import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const apiBaseUrl = await getApiBaseUrl()
		const authApiUrl = `${apiBaseUrl}/auth/logout`

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''

		const response = await fetch(authApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		const nextResponse = NextResponse.json({ success: true })

		// Forward Set-Cookie header from backend (to clear the cookie)
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			// If backend sends Set-Cookie to clear, forward it
			// Otherwise, clear it manually
			const cookies = setCookieHeader.split(',').map((c) => c.trim())
			for (const cookie of cookies) {
				const [nameValue] = cookie.split(';')
				const [name] = nameValue.split('=')
				if (name) {
					nextResponse.cookies.delete(name.trim())
				}
			}
		} else {
			// Clear common session cookie names
			nextResponse.cookies.delete('session_riddonk')
		}

		return nextResponse
	} catch (error) {
		console.error('Logout error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
