import { requireAdmin } from '@/app/lib/auth'
import { deleteTag, getTagById, updateTag } from '@/app/services/tagService'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	try {
		await requireAdmin()
		const { id } = await params
		const result = await getTagById(id)
		return NextResponse.json(result)
	} catch (error: any) {
		if (error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		if (error.status === 404) {
			return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
		}
		return NextResponse.json({ error: error.message || 'Failed to fetch tag' }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	try {
		await requireAdmin()
		const { id } = await params
		const body = await request.json()
		const { label, description, asset_name_path, order } = body

		if (!label) {
			return NextResponse.json({ error: 'label is required' }, { status: 400 })
		}

		const result = await updateTag(id, label, description, asset_name_path, order)
		return NextResponse.json(result)
	} catch (error: any) {
		if (error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		return NextResponse.json({ error: error.message || 'Failed to update tag' }, { status: error.status || 500 })
	}
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	try {
		await requireAdmin()
		const { id } = await params
		const result = await deleteTag(id)
		return NextResponse.json(result)
	} catch (error: any) {
		if (error.status === 401 || error.status === 403) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		return NextResponse.json({ error: error.message || 'Failed to delete tag' }, { status: error.status || 500 })
	}
}
