'use server'

import { DailyRiddleType } from '../schemas/DailyRiddleSchema'
import { PaginatedRiddlesDataType } from '../schemas/PaginatedRiddlesResponse'
import { ReddicoreResponseType } from '../schemas/ReddicoreResponse'
import { getApiBaseUrl, getApiKey } from '../util/apiConfig'
import { fetcher } from './fetcher'
import { getUserAvatars } from './userAvatarService'

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
		`${apiBaseUrl}/trending/riddles?days=3&limit=10`,
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

	// Fetch current avatar for web-created riddles
	if (data.postId.startsWith('r_') && data.author) {
		const avatarMap = await getUserAvatars([data.author])
		data.authorAvatar = avatarMap.get(data.author) || null
	}

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

	// Fetch avatars for all web-created riddles
	const webRiddles = data.riddles.filter((r) => r.postId.startsWith('r_') && r.author)
	const uniqueAuthors = [...new Set(webRiddles.map((r) => r.author).filter((a): a is string => a !== null))]

	if (uniqueAuthors.length > 0) {
		const avatarMap = await getUserAvatars(uniqueAuthors)
		data.riddles.forEach((riddle) => {
			if (riddle.postId.startsWith('r_') && riddle.author) {
				riddle.authorAvatar = avatarMap.get(riddle.author) || null
			}
		})
	}

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

	// Fetch avatars for all web-created riddles in this page
	const webRiddles = paginatedRiddles.filter((r) => r.postId.startsWith('r_') && r.author)
	const uniqueAuthors = [...new Set(webRiddles.map((r) => r.author).filter((a): a is string => a !== null))]

	if (uniqueAuthors.length > 0) {
		const avatarMap = await getUserAvatars(uniqueAuthors)
		paginatedRiddles.forEach((riddle) => {
			if (riddle.postId.startsWith('r_') && riddle.author) {
				riddle.authorAvatar = avatarMap.get(riddle.author) || null
			}
		})
	}

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

export const checkAnswer = async (postId: string, answer: string): Promise<{ correct: boolean; word?: string }> => {
	const riddle = await getRiddleByPostId(postId)
	const normalizedAnswer = answer.trim().toLowerCase()
	const correctAnswer = riddle.word.toLowerCase()
	const altAnswers = riddle.altwords ? riddle.altwords.split(',').map((w) => w.trim().toLowerCase()) : []

	const isCorrect = normalizedAnswer === correctAnswer || altAnswers.some((alt) => normalizedAnswer === alt)

	if (isCorrect) {
		return { correct: true, word: riddle.word }
	}
	return { correct: false }
}

export const revealAnswer = async (postId: string): Promise<{ word: string }> => {
	const riddle = await getRiddleByPostId(postId)
	return { word: riddle.word }
}

export const getWordLength = async (postId: string): Promise<number> => {
	const riddle = await getRiddleByPostId(postId)
	return riddle.word.length
}

export const getCurrentAdventure = async () => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`
	const adventureApiUrl = `${baseUrl}/api/v1/riddonk/web/daily/adventure`

	try {
		const { data } = await fetcher<ReddicoreResponseType<{ adventure: { adventureNumber: number } }>>(
			adventureApiUrl,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				method: 'GET',
			}
		)
		return data?.adventure?.adventureNumber || null
	} catch (error) {
		console.error('Error fetching current adventure:', error)
		return null
	}
}
