import { describe, it, beforeAll, vi, expect, Mock } from 'vitest'
import request from 'supertest'
import { createTestApp, setupDatabaseError } from '../test-utils'
import { db } from '../db'
import { analyticsRouter } from '../routes'
import * as logDB from '../respositories/log.repository'

const app = createTestApp('/api/visitor-analytics', analyticsRouter)

vi.mock('../db', () => ({
  db: {
    query: vi.fn()
  }
}))



describe('Analytics Route', () => {
  beforeAll(() => {
    vi.clearAllMocks()
  })

  function getVisitorAnalyticsRequest(daysAgo: number) {
    return request(app).get('/api/visitor-analytics').query({ daysAgo })
  }

  it('should return daily visitor counts and page popularity data', async () => {
    const mockVisitorCount = [{ date: '2024-12-05', visits: 42 }]
    const mockPagePopularity = [{ page: '/', visits: 100 }]

      vi.spyOn(logDB, 'getVisitorCount').mockResolvedValueOnce([mockVisitorCount])
      vi.spyOn(logDB, 'getPagePopularity').mockResolvedValueOnce([mockPagePopularity])

    const response = await getVisitorAnalyticsRequest(5)
    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      visitorCount: [mockVisitorCount],
      pagePopularity: [mockPagePopularity]
    })
  })

  it('should return 500 if database throws an error', async () => {

    setupDatabaseError(db)
    
    const response = await getVisitorAnalyticsRequest(25)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Internal server error' })
  })
})
