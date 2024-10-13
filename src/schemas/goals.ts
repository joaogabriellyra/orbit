import { z } from 'zod'

export const createGoalBodySchema = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number(),
})
