import { requireAdmin } from '@/app/lib/adminAuth'
import { createTag, listTags } from '@/app/services/tagService'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		await requireAdmin(cookieHeader)
		const searchParams = request.nextUrl.searchParams
		const limit = parseInt(searchParams.get('limit') || '50')
		const offset = parseInt(searchParams.get('offset') || '0')

		const result = await listTags(limit, offset)
		return NextResponse.json(result)
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		return NextResponse.json({ error: error.message || 'Failed to fetch tags' }, { status: 500 })
	}
}

export const POST = async (request: NextRequest) => {
	try {
		const cookieHeader = request.headers.get('cookie') || ''
		await requireAdmin(cookieHeader)
		const body = await request.json()
		const { id, label, description, asset_name_path, order } = body

		if (!id || !label) {
			return NextResponse.json({ error: 'id and label are required' }, { status: 400 })
		}

		const result = await createTag(id, label, description, asset_name_path, order)
		return NextResponse.json(result)
	} catch (error: any) {
		if (error.message === 'Admin access required' || error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
		}
		return NextResponse.json({ error: error.message || 'Failed to create tag' }, { status: error.status || 500 })
	}
}
