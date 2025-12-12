import { NextRequest, NextResponse } from 'next/server'
import { loginPublic } from '@/app/lib/publicAuth'

export const POST = async (request: NextRequest) => {
	try {
		const { password } = await request.json()
		const result = await loginPublic(password)

		if (result.success) {
			return NextResponse.json({ success: true })
		}

		return NextResponse.json({ success: false, error: result.error }, { status: 401 })
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
	}
}

