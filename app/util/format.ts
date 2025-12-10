export const formatDate = (milliDate: string) => {
	if (!milliDate) {
		return `-`
	}

	return new Date(Number(milliDate))
		.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
		.replace(',', '.')
}
