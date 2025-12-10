export class FetcherError extends Error {
	status: number
	data: any
	response?: Response

	constructor(status: number, message: string, data?: any, response?: Response) {
		super(message)
		this.name = 'FetcherError'
		this.status = status
		this.data = data
		this.response = response
	}

	getUserFriendlyMessage(): string {
		const message = this.data?.message || this.data?.errorMessage
		if (message) {
			return message
		}

		switch (this.status) {
			case 400:
				return 'Please check your input and try again.'
			case 401:
				return 'You are not authorized to perform this action.'
			case 403:
				return 'Access forbidden. You do not have permission to perform this action.'
			case 404:
				return 'The requested resource was not found.'
			case 409:
				return 'This item has already been submitted recently. Please try again in a week or choose a different item.'
			case 429:
				return 'Too many requests. Please try again later.'
			case 500:
				return 'An internal server error occurred. Please try again later.'
			default:
				return this.message || 'An error occurred. Please try again.'
		}
	}
}
