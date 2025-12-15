'use server'

import { DailyRiddleType } from '../schemas/DailyRiddleSchema'
import { PaginatedRiddlesDataType } from '../schemas/PaginatedRiddlesResponse'
import { ReddicoreResponseType } from '../schemas/ReddicoreResponse'
import { getApiBaseUrl, getApiKey } from '../util/apiConfig'
import { fetcher } from './fetcher'

export const getRiddleOfTheDay = async () => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const { data } = await fetcher<ReddicoreResponseType<DailyRiddleType>>(`${apiBaseUrl}/daily/riddle`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		method: 'GET',
	})
	return data
}

export const getRiddleByNumber = async (number?: number | undefined) => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const { data } = await fetcher<ReddicoreResponseType<DailyRiddleType>>(
		`${apiBaseUrl}/daily/riddle/${number ?? ''}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			method: 'GET',
		}
	)
	return data
}

export const getTrendingRiddles = async () => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const { data } = await fetcher<ReddicoreResponseType<DailyRiddleType[]>>(
		`${apiBaseUrl}/trending/riddles?days=5&limit=10`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			method: 'GET',
		}
	)
	return data
}

export const getRiddleByPostId = async (postId: string) => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const { data } = await fetcher<ReddicoreResponseType<DailyRiddleType>>(`${apiBaseUrl}/riddle/${postId}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		method: 'GET',
	})
	return data
}

export const getRiddlesByTag = async (tagId: string, limit = 10, offset = 0): Promise<PaginatedRiddlesDataType> => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	const { data } = await fetcher<ReddicoreResponseType<PaginatedRiddlesDataType>>(
		`${baseUrl}/api/v1/riddonk/web/tags/${tagId}/riddles?limit=${limit}&offset=${offset}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			method: 'GET',
		}
	)
	return data
}

export const getLatestRiddles = async (limit = 5, offset = 0, maxDays = 30): Promise<PaginatedRiddlesDataType> => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`

	const fetchLimit = Math.max(limit * 10, 100)
	const { data } = await fetcher<ReddicoreResponseType<PaginatedRiddlesDataType>>(
		`${baseUrl}/api/v1/riddonk/web/riddles?limit=${fetchLimit}&offset=0&sort=newest`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			method: 'GET',
		}
	)

	const now = Date.now()
	const maxDaysAgo = now - maxDays * 24 * 60 * 60 * 1000

	const filteredRiddles = data.riddles.filter((riddle) => {
		if (!riddle.date) return false
		const riddleDate = Number(riddle.date)
		return riddleDate >= maxDaysAgo
	})

	const paginatedRiddles = filteredRiddles.slice(offset, offset + limit)
	const total = filteredRiddles.length
	const hasNext = offset + limit < total
	const hasPrev = offset > 0
	const currentPage = Math.floor(offset / limit) + 1
	const totalPages = Math.ceil(total / limit)

	return {
		riddles: paginatedRiddles,
		pagination: {
			currentPage,
			totalPages,
			total,
			limit,
			offset,
			hasNext,
			hasPrev,
		},
		filters: {},
	}
}
