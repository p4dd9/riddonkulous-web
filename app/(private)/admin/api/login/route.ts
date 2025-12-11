import { NextRequest, NextResponse } from 'next/server'
import { loginAdmin } from '@/app/lib/auth'

export const POST = async (request: NextRequest) => {
	try {
		const { username, password } = await request.json()
		const result = await loginAdmin(username, password)
		
		if (result.success) {
			return NextResponse.json({ success: true })
		}
		
		return NextResponse.json({ success: false, error: result.error }, { status: 401 })
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
	}
}

