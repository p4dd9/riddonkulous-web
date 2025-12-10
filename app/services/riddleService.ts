'use server'

import { DailyRiddleType } from '../schemas/DailyRiddleSchema'
import { ReddicoreResponseType } from '../schemas/ReddicoreResponse'
import { serverLogger } from '../util/logger'
import { fetcher } from './fetcher'

const getApiBaseUrl = () => {
	if (!process.env.REDDICORE_API_BASE_URL) {
		serverLogger.error('REDDICORE_API_BASE_URL is not set')
		throw new Error('REDDICORE_API_BASE_URL is not set')
	}
	return process.env.REDDICORE_API_BASE_URL
}

const getApiKey = () => {
	if (!process.env.REDDICORE_API_KEY) {
		serverLogger.error('REDDICORE_API_KEY is not set')
		throw new Error('REDDICORE_API_KEY is not set')
	}
	return process.env.REDDICORE_API_KEY
}

export const getRiddleOfTheDay = async () => {
	const apiBaseUrl = getApiBaseUrl()
	const apiKey = getApiKey()
	const { data } = await fetcher<ReddicoreResponseType<DailyRiddleType>>(`${apiBaseUrl}/daily/riddle`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		method: 'GET',
	})
	return data
}
