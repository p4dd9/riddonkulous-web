'use server'

import { getApiBaseUrl, getApiKey } from '../util/apiConfig'
import { fetcher } from './fetcher'

export interface PublicUserRiddle {
	postId: string
	word: string
	riddle: string
	tags: string[]
	createdAt: string
}

export interface PublicUserProfile {
	username: string
	joinedDate: string
	avatar?: string
	riddles: PublicUserRiddle[]
}

export interface GetUserProfileResponse {
	status: 'success'
	data: PublicUserProfile
}

/**
 * Get public user profile by username (server-side)
 */
export const getUserProfileByUsername = async (username: string): Promise<PublicUserProfile> => {
	const apiBaseUrl = await getApiBaseUrl()
	const apiKey = await getApiKey()
	const urlObj = new URL(apiBaseUrl)
	const baseUrl = `${urlObj.protocol}//${urlObj.host}`

	const { data } = await fetcher<GetUserProfileResponse>(
		`${baseUrl}/api/v1/riddonk/web/user/profile/${encodeURIComponent(username)}`,
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
