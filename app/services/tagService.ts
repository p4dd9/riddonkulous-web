'use server'

import { getApiBaseUrl, getApiKey } from '../util/apiConfig'
import { clientLogger } from '../util/logger'
import { fetcher } from './fetcher'

export interface Tag {
	id: string
	label: string
	description?: string
	count?: number
	order?: number
	asset_name_path?: string
	_id?: string
	createdAt?: string
	updatedAt?: string
	__v?: number
}

interface TagApiResponse {
	status: string
	data: {
		tags: Tag[]
		count: number
		total: number
		limit?: number
		offset?: number
	}
}

interface TagApiSingleResponse {
	status: string
	data: Tag
}

const getTagApiUrl = async (path: string): Promise<string> => {
	const reddicoreBaseUrl = await getApiBaseUrl()

	const urlObj = new URL(reddicoreBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`

	// Use /api/v1/tags as the tag API endpoint
	return `${baseUrl}/api/v1/riddonk/web/tags${path}`
}

const getAuthHeaders = async () => {
	const apiKey = await getApiKey()
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`,
	}
}

export interface TagListResponse {
	tags: Tag[]
	count: number
	total: number
}

export const listTags = async (limit = 50, offset = 0): Promise<TagListResponse> => {
	const url = await getTagApiUrl(`?limit=${limit}&offset=${offset}`)
	clientLogger.info('listTags')
	clientLogger.info(url)
	const headers = await getAuthHeaders()
	const response = await fetcher<TagApiResponse>(url, {
		headers,
		method: 'GET',
	})
	return {
		tags: response.data.tags,
		count: response.data.count,
		total: response.data.total,
	}
}

export const getTagById = async (id: string): Promise<Tag> => {
	const url = await getTagApiUrl(`/${id}`)
	const headers = await getAuthHeaders()
	const response = await fetcher<TagApiSingleResponse>(url, {
		headers,
		method: 'GET',
	})
	return response.data
}

export const createTag = async (
	id: string,
	label: string,
	description?: string,
	asset_name_path?: string,
	order?: number
): Promise<Tag> => {
	const url = await getTagApiUrl('')
	const headers = await getAuthHeaders()
	const body: { id: string; label: string; description?: string; asset_name_path?: string; order?: number } = {
		id,
		label,
	}
	if (description) {
		body.description = description
	}
	if (asset_name_path) {
		body.asset_name_path = asset_name_path
	}
	if (order !== undefined) {
		body.order = order
	}
	const response = await fetcher<TagApiSingleResponse>(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	})
	return response.data
}

export const updateTag = async (
	id: string,
	label: string,
	description?: string,
	asset_name_path?: string,
	order?: number
): Promise<Tag> => {
	const url = await getTagApiUrl(`/${id}`)
	const headers = await getAuthHeaders()
	const body: { label: string; description?: string; asset_name_path?: string; order?: number } = { label }
	if (description !== undefined) {
		body.description = description
	}
	if (asset_name_path !== undefined) {
		body.asset_name_path = asset_name_path
	}
	if (order !== undefined) {
		body.order = order
	}
	const response = await fetcher<TagApiSingleResponse>(url, {
		method: 'PUT',
		headers,
		body: JSON.stringify(body),
	})
	return response.data
}

export const deleteTag = async (id: string): Promise<{ message: string }> => {
	const url = await getTagApiUrl(`/${id}`)
	const headers = await getAuthHeaders()
	return fetcher<{ message: string }>(url, {
		method: 'DELETE',
		headers,
	})
}
