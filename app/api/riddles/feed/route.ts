import { getCurrentUserServer } from '@/app/lib/serverAuth'
import { getLatestRiddles } from '@/app/services/riddleService'
import { stripSolutions } from '@/app/util/stripSolution'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		const user = await getCurrentUserServer(cookieHeader)

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized - Login required' }, { status: 401 })
		}

		const searchParams = request.nextUrl.searchParams
		const limit = parseInt(searchParams.get('limit') || '5', 10)
		const offset = parseInt(searchParams.get('offset') || '0', 10)

		const data = await getLatestRiddles(limit, offset)

		// Strip solution data from riddles before sending to client
		const safeData = { ...data, riddles: stripSolutions(data.riddles) }

		return NextResponse.json(safeData)
	} catch (error) {
		console.error('Error fetching riddle feed:', error)
		return NextResponse.json({ error: 'Failed to fetch riddles' }, { status: 500 })
	}
}
