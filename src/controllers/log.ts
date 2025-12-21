import { LogEventInput } from '../dtos/log.dto'
import { LogRepository } from '../repositories/log.repository'
import { LogService } from '../services/log.service'
import { Request, Response } from 'express'

const logService = new LogService(new LogRepository())

export async function logUserActivity(req: Request, res: Response) {
  try {
    const data: LogEventInput = req.body
    const success = await logService.logUserActivity(data, req.ip)

    if (!success) {
      return res.status(403).json({ error: 'Bot user detected' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Error logging event:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getUserActivityLog(req: Request, res: Response) {
  try {
    const [visitorCount, pagePopularity] = await logService.getUserActivityLog(
      Number(req.query.daysAgo) || 30
    )

    return res.status(200).json({ visitorCount, pagePopularity })
  } catch (err) {
    console.error(`Error getting visitor analytics:`, err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
