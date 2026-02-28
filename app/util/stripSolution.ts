import type { DailyRiddleType, SafeRiddleType } from '@/app/schemas/DailyRiddleSchema'

const shuffleWord = (word: string): string => {
	const letters = word.toLowerCase().split('')
	let shuffled: string[]
	let attempts = 0

	do {
		shuffled = [...letters].sort(() => Math.random() - 0.5)
		attempts++
		const isSame = shuffled.every((letter, index) => letter === letters[index])
		if (!isSame) break
	} while (attempts < 100)

	return shuffled.join('')
}

export const stripSolution = (riddle: DailyRiddleType, includeScrambled = false): SafeRiddleType => {
	const { word, altwords, ...safe } = riddle
	return {
		...safe,
		wordLength: word.length,
		...(includeScrambled ? { scrambledLetters: shuffleWord(word) } : {}),
	}
}

export const stripSolutions = (riddles: DailyRiddleType[], includeScrambled = false): SafeRiddleType[] =>
	riddles.map((r) => stripSolution(r, includeScrambled))
