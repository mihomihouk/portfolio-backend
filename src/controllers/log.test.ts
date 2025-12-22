import { GetUserActivityLog } from './../dtos/log.dto'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import request from 'supertest'
import logRouter from '../routes/log.route'
import * as botDetection from '../utils/bot-detection'
import { createTestApp, setupDatabaseError } from '../test-utils'
import { db } from '../db'
import { analyticsRouter } from '../routes'
import * as logRepo from '../repositories/log.repository'
import { LogEventInput } from '../dtos/log.dto'

vi.mock('../db', () => ({
  db: {
    query: vi.fn()
  }
}))

describe('Log Route', () => {
  const app = createTestApp('/api/log', logRouter)
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  function makePostRequest(payload: Partial<LogEventInput>) {
    return request(app).post('/api/log').send(payload)
  }

  const invalidPayload = [
    { event: undefined, path: 'test', userAgent: 'Mozilla/5.0' },
    { event: 'test', path: undefined, userAgent: 'Mozilla/5.0' },
    { event: undefined, path: undefined, userAgent: 'Mozilla/5.0' }
  ]

  const validPayload = {
    event: 'test',
    path: 'test',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }

  it.each(invalidPayload)(
    'should return 400 if event or path is not provided',
    async payload => {
      const response = await makePostRequest(payload)
      expect(response.status).toBe(400)
    }
  )

  it('should return 403 if bot user is detected', async () => {
    // Mock the bot detection function to return true
    vi.spyOn(botDetection, 'isBotUser').mockResolvedValue(true)
    const response = await makePostRequest(validPayload)
    expect(response.status).toBe(403)
  })

  it('should return 200 if log is successful', async () => {
    const response = await makePostRequest(validPayload)
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  })

  it('should return 500 if database throws an error', async () => {
    setupDatabaseError(db)
    const response = await makePostRequest(validPayload)
    expect(response.status).toBe(500)
  })
})

describe('Analytics Route', () => {
  const app = createTestApp('/api/visitor-analytics', analyticsRouter)

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  function getVisitorAnalyticsRequest(payload: GetUserActivityLog) {
    return request(app).get('/api/visitor-analytics').query(payload)
  }

  it('should return daily visitor counts and page popularity data', async () => {
    const mockVisitorCount = [{ date: '2024-12-05', visits: 42 }]
    const mockPagePopularity = [{ page: '/', visits: 100 }]

    vi.spyOn(
      logRepo.LogRepository.prototype,
      'getVisitorCount'
    ).mockResolvedValue(mockVisitorCount)
    vi.spyOn(
      logRepo.LogRepository.prototype,
      'getPagePopularity'
    ).mockResolvedValue(mockPagePopularity)

    const response = await getVisitorAnalyticsRequest({ daysAgo: 5 })
    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      visitorCount: mockVisitorCount,
      pagePopularity: mockPagePopularity
    })
  })

  it('should return 500 if database throws an error', async () => {
    setupDatabaseError(db)

    const response = await getVisitorAnalyticsRequest({ daysAgo: 25 })
    expect(response.status).toBe(500)
  })
})
