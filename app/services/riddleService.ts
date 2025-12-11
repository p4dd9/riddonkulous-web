'use server'

import { DailyRiddleType } from '../schemas/DailyRiddleSchema'
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
		`${apiBaseUrl}/trending/riddles?days=200&limit=10`,
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
