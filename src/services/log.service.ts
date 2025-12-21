import { LogEventInput } from '../dtos/log.dto'
import { LogRepository } from '../repositories/log.repository'
import { isBotUser } from '../utils/bot-detection'

export class LogService {
  constructor(private logRepo: LogRepository) {}
  async logUserActivity(data: LogEventInput, ip?: string) {
    if (data.userAgent && ip) {
      const isBot = await isBotUser(data.userAgent, ip)
      if (isBot) return false
    }
    await this.logRepo.logEvent({ ...data, ip })
    return true
  }

  async getUserActivityLog(daysAgo: number) {
    return await Promise.all([
      this.logRepo.getVisitorCount({ daysAgo }),
      this.logRepo.getPagePopularity({ daysAgo })
    ])
  }
}
