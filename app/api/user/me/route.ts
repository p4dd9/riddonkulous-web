import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

const USER_API_ENDPOINT = '/api/v1/riddonk/web/user/me'

const getUserApiUrl = async (): Promise<string> => {
	const apiBaseUrl = await getApiBaseUrl()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	return `${baseUrl}${USER_API_ENDPOINT}`
}

export async function GET(request: NextRequest) {
	try {
		const userApiUrl = await getUserApiUrl()

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''

		const response = await fetch(userApiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to fetch user data',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Get user error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const userApiUrl = await getUserApiUrl()

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''
		const body = await request.json()

		const response = await fetch(userApiUrl, {
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
				message: 'Failed to update user',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Update user error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const userApiUrl = await getUserApiUrl()

		// Forward cookies from the incoming request to the backend
		const cookieHeader = request.headers.get('cookie') || ''

		const response = await fetch(userApiUrl, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Failed to delete user',
			}))
			return NextResponse.json(error, { status: response.status })
		}

		const data = await response.json()

		// Create response and clear session cookie
		const nextResponse = NextResponse.json(data)
		nextResponse.cookies.delete('session_riddonk')

		return nextResponse
	} catch (error) {
		console.error('Delete user error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
