'use server'

import { z } from 'zod'
import { FetcherError } from '../schemas/FetchError'
import { serverLogger } from '../util/logger'

interface FetchOptions extends RequestInit {
	schema?: z.ZodSchema
}

export const fetcher = async <T = any>(url: string, options: FetchOptions = {}): Promise<T> => {
	const { schema, body, method = 'GET', ...fetchOptions } = options

	const defaultHeaders = {
		'Content-Type': 'application/json',
		...fetchOptions.headers,
	}

	let fetchBody = body
	if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
		fetchBody = typeof body === 'string' ? body : JSON.stringify(body)
	}

	const response = await fetch(url, {
		...fetchOptions,
		method,
		headers: defaultHeaders,
		body: fetchBody,
	})

	if (!response.ok) {
		let errorData: any = null
		try {
			errorData = await response.json()
		} catch {
			// If response is not JSON, use default error
		}
		serverLogger.error(
			`Error fetching ${url}: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
		)
		const defaultMessage = `HTTP error! status: ${response.status}`
		throw new FetcherError(response.status, defaultMessage, errorData, response)
	}

	const data = await response.json()

	if (schema) {
		return schema.parse(data) as T
	}

	return data as T
}
