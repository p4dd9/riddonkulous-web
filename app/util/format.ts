export const formatDate = (milliDate: string | number | null) => {
	if (!milliDate) {
		return `-`
	}

	return new Date(Number(milliDate))
		.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
		.replace(',', '.')
}

export const formatPopularity = (popularity: number | null | undefined): number => {
	if (popularity === null || popularity === undefined || isNaN(Number(popularity))) {
		return 0
	}

	const num = Number(popularity)
	return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.round(num)))
}
