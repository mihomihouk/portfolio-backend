import { describe, it, vi, expect, beforeEach } from 'vitest'
import * as botDetection from '../utils/bot-detection'
import { LogService } from './log.service'
import { createMockLogRepository } from '../factories/logRepository.mock'

describe('Log Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockRepo = createMockLogRepository()

  describe('logUserActivity', () => {
    it('logs event for human users', async () => {
      vi.spyOn(botDetection, 'isBotUser').mockResolvedValue(false)

      const service = new LogService(mockRepo)

      const result = await service.logUserActivity({
        event: 'page_view',
        path: '/',
        referrer: '',
        userAgent: 'Mozilla',
        ip: '1.1.1.1'
      })

      expect(result).toBe(true)
      expect(mockRepo.logEvent).toHaveBeenCalledOnce()
    })

    it('blocks bot users', async () => {
      vi.spyOn(botDetection, 'isBotUser').mockResolvedValue(true)

      const service = new LogService(mockRepo)

      const result = await service.logUserActivity({
        event: 'page_view',
        path: '/',
        referrer: '',
        userAgent: 'bot',
        ip: '1.1.1.1'
      })

      expect(result).toBe(false)
      expect(mockRepo.logEvent).not.toHaveBeenCalled()
    })
  })

  describe('getUserActivity', () => {
    it('returns visitor analytics data', async () => {
      const visitorCount = [{ date: '2024-12-05', visits: 42 }]
      const pagePopularity = [{ page: '/', visits: 100 }]

      vi.spyOn(mockRepo, 'getVisitorCount').mockResolvedValue(visitorCount)
      vi.spyOn(mockRepo, 'getPagePopularity').mockResolvedValue(pagePopularity)

      const service = new LogService(mockRepo)

      const result = await service.getUserActivityLog(7)

      expect(result).toEqual([visitorCount, pagePopularity])
    })
  })
})
