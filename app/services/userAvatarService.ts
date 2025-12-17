'use server'

import { getApiBaseUrl, getApiKey } from '../util/apiConfig'
import { fetcher } from './fetcher'

interface UserAvatarResponse {
	status: 'success'
	data: {
		username: string
		avatar: string
	}
}

/**
 * Get user avatar by username (lightweight endpoint)
 * This fetches the current avatar, so changes are reflected everywhere
 */
export const getUserAvatar = async (username: string): Promise<string | null> => {
	try {
		const apiBaseUrl = await getApiBaseUrl()
		const apiKey = await getApiKey()
		const urlObj = new URL(apiBaseUrl)
		const baseUrl = `${urlObj.protocol}//${urlObj.host}`

		// Use the public profile endpoint which returns current avatar
		const { data } = await fetcher<UserAvatarResponse>(
			`${baseUrl}/api/v1/riddonk/web/user/profile/${encodeURIComponent(username)}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				method: 'GET',
				next: { revalidate: 120 }, // Cache for 2 minutes
			}
		)

		return data.avatar || 'avatar_02.png'
	} catch (error) {
		console.error(`Failed to fetch avatar for ${username}:`, error)
		return 'avatar_02.png' // Fallback to default
	}
}

/**
 * Get avatars for multiple users at once
 * Returns a map of username -> avatar
 */
export const getUserAvatars = async (usernames: string[]): Promise<Map<string, string>> => {
	const avatarMap = new Map<string, string>()

	// Fetch all avatars in parallel
	const promises = usernames.map(async (username) => {
		const avatar = await getUserAvatar(username)
		return { username, avatar: avatar || 'avatar_02.png' }
	})

	const results = await Promise.all(promises)

	results.forEach(({ username, avatar }) => {
		avatarMap.set(username, avatar)
	})

	return avatarMap
}

