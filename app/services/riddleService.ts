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
