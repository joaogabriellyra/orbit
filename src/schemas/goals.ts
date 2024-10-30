import { z } from 'zod'

export const createGoalBodySchema = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

export const checkAGoalIdSchema = z.object({
  id: z.string().cuid2(),
})
