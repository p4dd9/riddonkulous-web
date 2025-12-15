import { getApiBaseUrl } from '@/app/util/apiConfig'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { idToken } = await request.json()
		if (!idToken) {
			return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
		}

		const apiBaseUrl = await getApiBaseUrl()
		const authApiUrl = `${apiBaseUrl}/auth/login`

		const cookieHeader = request.headers.get('cookie') || ''

		const response = await fetch(authApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { Cookie: cookieHeader }),
			},
			body: JSON.stringify({ idToken }),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				status: response.status,
				message: 'Login failed',
			}))
			return NextResponse.json({ error: error.message || 'Login failed' }, { status: response.status })
		}

		const data = await response.json()
		const nextResponse = NextResponse.json(data)

		// Forward Set-Cookie header from backend to client
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			// Parse the Set-Cookie header and set it on the response
			// Set-Cookie can have multiple cookies separated by commas, but only if they're not in quotes
			// For simplicity, we'll handle the common case of a single cookie
			const cookies = setCookieHeader.split(',').map((c) => c.trim())

			for (const cookie of cookies) {
				// Extract cookie name and value
				const parts = cookie.split(';')
				const [nameValue] = parts
				const [name, ...valueParts] = nameValue.split('=')

				if (name && valueParts.length > 0) {
					const value = valueParts.join('=')

					// Extract cookie attributes
					const attributes: { [key: string]: string | boolean | number | Date } = {}
					for (let i = 1; i < parts.length; i++) {
						const part = parts[i].trim()
						const [key, val] = part.split('=')
						const lowerKey = key.toLowerCase()

						if (lowerKey === 'httponly') {
							attributes.httpOnly = true
						} else if (lowerKey === 'secure') {
							attributes.secure = true
						} else if (lowerKey === 'samesite') {
							attributes.sameSite = (val?.toLowerCase() || 'lax') as 'lax' | 'strict' | 'none'
						} else if (lowerKey === 'path') {
							attributes.path = val || '/'
						} else if (lowerKey === 'max-age') {
							attributes.maxAge = parseInt(val || '0', 10)
						} else if (lowerKey === 'expires') {
							attributes.expires = new Date(val || '')
						}
					}

					// Set default values
					nextResponse.cookies.set(name.trim(), value.trim(), {
						httpOnly: (attributes.httpOnly as boolean) ?? true,
						secure: (attributes.secure as boolean) ?? process.env.NODE_ENV === 'production',
						sameSite: (attributes.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
						path: (attributes.path as string) ?? '/',
						...(attributes.maxAge && { maxAge: attributes.maxAge as number }),
						...(attributes.expires && { expires: attributes.expires as Date }),
					})
				}
			}
		}

		return nextResponse
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
