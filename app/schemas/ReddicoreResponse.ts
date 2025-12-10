import { z } from 'zod'

export const ReddicoreResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		data: dataSchema,
		status: z.string().min(0).max(1000),
	})

export type ReddicoreResponseType<T> = {
	data: T
	status: string
}
