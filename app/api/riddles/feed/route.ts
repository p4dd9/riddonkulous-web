import { getLatestRiddles } from '@/app/services/riddleService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const limit = parseInt(searchParams.get('limit') || '5', 10)
		const offset = parseInt(searchParams.get('offset') || '0', 10)

		const data = await getLatestRiddles(limit, offset)

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching riddle feed:', error)
		return NextResponse.json({ error: 'Failed to fetch riddles' }, { status: 500 })
	}
}

