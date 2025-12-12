import { listTags } from '@/app/services/tagService'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // 1 hour

export async function GET() {
	try {
		const data = await listTags(50, 0)
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching tags:', error)
		return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
	}
}

