import { Filter } from 'bad-words'

// Create a singleton instance of the filter
let filterInstance: Filter | null = null

const getFilter = (): Filter => {
	if (!filterInstance) {
		filterInstance = new Filter()
	}
	return filterInstance
}

/**
 * Check if text contains profanity
 */
export const containsProfanity = (text: string): boolean => {
	if (!text || typeof text !== 'string') {
		return false
	}

	const filter = getFilter()
	return filter.isProfane(text)
}

/**
 * Clean profanity from text by replacing with asterisks
 */
export const cleanProfanity = (text: string): string => {
	if (!text || typeof text !== 'string') {
		return text
	}

	const filter = getFilter()
	return filter.clean(text)
}

/**
 * Validate text for profanity and return error message if found
 */
export const validateProfanity = (text: string, fieldName: string = 'Text'): string | null => {
	if (containsProfanity(text)) {
		return `${fieldName} contains inappropriate language. Please revise your content.`
	}
	return null
}

/**
 * Add custom words to the profanity filter
 */
export const addCustomWords = (words: string[]): void => {
	const filter = getFilter()
	filter.addWords(...words)
}

/**
 * Remove words from the profanity filter (for false positives)
 */
export const removeWords = (words: string[]): void => {
	const filter = getFilter()
	filter.removeWords(...words)
}
