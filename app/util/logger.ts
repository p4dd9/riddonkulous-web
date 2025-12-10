type Message = string | number | boolean | null | undefined | object

class Logger {
	context: string

	constructor(context = '') {
		this.context = context ? `[${context}] ` : ''
	}

	private log(level: 'info' | 'warn' | 'error', message: Message) {
		const timestamp = new Date().toISOString()
		const formattedMessage = `${timestamp} [${level.toUpperCase()}] ${this.context}${
			typeof message === 'object' && message !== null ? JSON.stringify(message) : message
		}`

		if (level === 'error') {
			console.error(formattedMessage)
		} else if (level === 'warn') {
			console.warn(formattedMessage)
		} else {
			console.log(formattedMessage)
		}
	}

	info(message: Message) {
		try {
			this.log('info', `${message}`)
		} catch (e) {
			this.log('error', `Failed to log message: ${e}`)
		}
	}

	warn(message: Message) {
		try {
			this.log('warn', `${message}`)
		} catch (e) {
			this.log('error', `Failed to log message: ${e}`)
		}
	}

	error(message: Message) {
		try {
			this.log('error', `${message}`)
		} catch (e) {
			this.log('error', `Failed to log message: ${e}`)
		}
	}
}

export const serverLogger = new Logger('Server')
export const clientLogger = new Logger('Client')
