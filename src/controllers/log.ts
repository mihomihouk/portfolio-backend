import { LogRepository } from '../repositories/log.repository'
import { LogService } from '../services/log.service'
import { Request, Response } from 'express'

const logService = new LogService(new LogRepository())

export async function logUserActivity(req: Request, res: Response) {
  try {
    const { event, path, referrer, userAgent } = req.body

    if (!event || !path) {
      return res.status(400).json({ error: 'Event and path are required' })
    }

    const logData = { event, path, referrer, userAgent, ip: req.ip }

    const success = await logService.logUserActivity(logData)
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
    const daysAgo = req.query.daysAgo ? Number(req.query.daysAgo) : 30

    const [visitorCount, pagePopularity] =
      await logService.getUserActivityLog(daysAgo)

    return res.status(200).json({ visitorCount, pagePopularity })
  } catch (err) {
    console.error(`Error getting visitor analytics:`, err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
