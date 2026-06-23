import { useEffect, useState } from 'react'

const GUESS_WORDS = [
	'shadow',
	'mirror',
	'echo',
	'fire',
	'water',
	'time',
	'clock',
	'wind',
	'silence',
	'nothing',
	'breath',
	'coin',
	'map',
	'key',
	'book',
	'door',
	'light',
	'moon',
	'sun',
	'star',
	'cloud',
	'rain',
	'snow',
	'egg',
	'hole',
	'stamp',
	'towel',
	'secret',
	'footsteps',
	'candle',
]

const ROTATE_INTERVAL_MS = 5000
const TYPE_DELAY_MIN_MS = 100
const TYPE_DELAY_MAX_MS = 160
const BETWEEN_WORDS_DELAY_MS = 400

const shuffle = <T,>(items: T[]): T[] => {
	const copy = [...items]
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))
		;[copy[i], copy[j]] = [copy[j], copy[i]]
	}
	return copy
}

export const useAnimatedGuessPlaceholder = (active: boolean) => {
	const [text, setText] = useState('')

	useEffect(() => {
		if (!active) {
			setText('')
			return
		}

		if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setText('Type your answer here...')
			return
		}

		const words = shuffle(GUESS_WORDS)
		let wordIndex = 0
		let charIndex = 0
		let timeoutId: ReturnType<typeof setTimeout>
		let cancelled = false

		const schedule = (delay: number, fn: () => void) => {
			timeoutId = setTimeout(() => {
				if (!cancelled) fn()
			}, delay)
		}

		const typeDelay = () => TYPE_DELAY_MIN_MS + Math.floor(Math.random() * (TYPE_DELAY_MAX_MS - TYPE_DELAY_MIN_MS))

		const tick = () => {
			const word = words[wordIndex % words.length]

			if (charIndex < word.length) {
				charIndex += 1
				setText(word.slice(0, charIndex))
				schedule(typeDelay(), tick)
				return
			}

			setText(`${word}?`)
			schedule(ROTATE_INTERVAL_MS, () => {
				wordIndex += 1
				charIndex = 0
				setText('')
				schedule(BETWEEN_WORDS_DELAY_MS, tick)
			})
		}

		schedule(BETWEEN_WORDS_DELAY_MS, tick)

		return () => {
			cancelled = true
			clearTimeout(timeoutId)
		}
	}, [active])

	return text
}
