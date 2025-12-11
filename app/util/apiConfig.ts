'use server'

import { serverLogger } from './logger'

export const getApiBaseUrl = async (): Promise<string> => {
	const baseUrl = process.env['REDDICORE_API_BASE_URL']

	if (!baseUrl) {
		serverLogger.error(`REDDICORE_API_BASE_URL is not set`)
		throw new Error(`REDDICORE_API_BASE_URL is not set. Please set REDDICORE_API_BASE_URL environment variable.`)
	}

	return baseUrl
}

export const getApiKey = async (): Promise<string> => {
	const apiKey = process.env['REDDICORE_API_KEY']

	if (!apiKey) {
		serverLogger.error(`REDDICORE_API_KEY is not set`)
		throw new Error(`REDDICORE_API_KEY is not set. Please set REDDICORE_API_KEY environment variable.`)
	}

	return apiKey
}
