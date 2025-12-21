import { LogRepository } from '../repositories/log.repository'
import { isBotUser } from '../utils/bot-detection'

export class LogService {
  constructor(private logRepo: LogRepository) {}
  async logUserActivity(data: {
    event: string
    path: string
    referrer: string
    userAgent: string
    ip?: string | undefined
  }) {
    if (data.userAgent && data.ip) {
      const isBot = await isBotUser(data.userAgent, data.ip)
      if (isBot) return false
    }
    await this.logRepo.logEvent(data)
    return true
  }

  async getUserActivityLog(daysAgo: number) {
    return await Promise.all([
      this.logRepo.getVisitorCount({ daysAgo }),
      this.logRepo.getPagePopularity({ daysAgo })
    ])
  }
}
