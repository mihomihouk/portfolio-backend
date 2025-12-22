import { LogEventInput } from '../dtos/log.dto'
import { HttpError } from '../errors/http-error'
import { LogRepository } from '../repositories/log.repository'
import { LogService } from '../services/log.service'
import { NextFunction, Request, Response } from 'express'

const logService = new LogService(new LogRepository())

export async function logUserActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const data: LogEventInput = req.body
    const success = await logService.logUserActivity(data, req.ip)

    if (!success) {
      throw new HttpError(403, 'Bot user detected')
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    next(err)
  }
}

export async function getUserActivityLog(req: Request, res: Response, next: NextFunction) {
  try {
    const [visitorCount, pagePopularity] = await logService.getUserActivityLog(
      Number(req.query.daysAgo) || 30
    )
    return res.status(200).json({ visitorCount, pagePopularity })
  } catch (err) {
    next(err)
  }
}
