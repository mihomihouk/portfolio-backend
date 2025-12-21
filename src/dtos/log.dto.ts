import { z } from 'zod'

export const LogEventDTO = z.object({
  event: z.string().min(1),
  path: z.string().min(1),
  referrer: z.string().optional(),
  userAgent: z.string()
})

export type LogEventInput = z.infer<typeof LogEventDTO>