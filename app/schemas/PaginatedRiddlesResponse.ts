import { z } from 'zod'
import { DailyRiddleSchema } from './DailyRiddleSchema'

export const PaginationSchema = z.object({
	currentPage: z.number(),
	totalPages: z.number(),
	total: z.number(),
	limit: z.number(),
	offset: z.number(),
	hasNext: z.boolean(),
	hasPrev: z.boolean(),
})

export const FiltersSchema = z.object({
	includeTags: z.array(z.string()).optional(),
	excludeTags: z.array(z.string()).optional(),
})

export const PaginatedRiddlesDataSchema = z.object({
	riddles: z.array(DailyRiddleSchema),
	pagination: PaginationSchema,
	filters: FiltersSchema,
})

export type PaginationType = z.infer<typeof PaginationSchema>
export type FiltersType = z.infer<typeof FiltersSchema>
export type PaginatedRiddlesDataType = z.infer<typeof PaginatedRiddlesDataSchema>
