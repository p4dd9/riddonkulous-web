import { z } from 'zod'

export const DailyRiddleSchema = z.object({
	riddleNumber: z.number().int().min(1),
	featuredDate: z.date(),
	// Duplicate all fields from RiddleCreation (no reference)
	postId: z.string().min(0).max(1000),
	type: z.string().min(0).max(1000).nullable(),
	author: z.string().min(0).max(1000).nullable(),
	authorSnoo: z.string().min(0).max(1000).nullable(),
	solverSnooAvatars: z.string().min(0).max(200000).nullable(),
	userId: z.string().min(0).max(1000).nullable(),
	date: z.string().min(0).max(1000).nullable(),
	word: z.string().min(0).max(1000),
	altwords: z.string().min(0).max(1000).nullable(),
	riddle: z.string().min(0).max(1000),
	bg: z.string().min(0).max(1000).nullable(),
	workshopFont: z.string().min(0).max(1000).nullable(),
	authorEnabledHints: z.string().min(0).max(1000).nullable(),
	feedbackCommentEnabled: z.string().min(0).max(1000).nullable(),
	subreddit: z.string().min(0).max(1000).nullable(),
	postType: z.string().min(0).max(1000).nullable(),
	score: z.number().min(0).nullable(),
	popularity: z.number().nullable(),
	solved: z.string().min(0).max(1000).nullable(),
	guessCount: z.string().min(0).max(1000).nullable(),
	guessCorrectlyCount: z.string().min(0).max(1000).nullable(),
	giveUpCount: z.string().min(0).max(1000).nullable(),
	title: z.string().min(0).max(1000).nullable(),
	context: z.string().min(0).max(1000).nullable(),
	userid: z.string().min(0).max(1000).nullable(),
	subredditId: z.string().min(0).max(1000).nullable(),
})

export type DailyRiddleType = z.infer<typeof DailyRiddleSchema>
