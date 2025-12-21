import { z } from 'zod'

export const LogEventDTO = z.object({
  event: z.string().min(1),
  path: z.string().min(1),
  referrer: z.string().optional(),
  userAgent: z.string()
})

export type LogEventInput = z.infer<typeof LogEventDTO>

export const GetUserActivityLogDTO = z.object({
  daysAgo: z.coerce.number().positive().optional()
})

export type GetUserActivityLog = z.infer<typeof GetUserActivityLogDTO>
