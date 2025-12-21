import { describe, it, beforeAll, vi, expect } from 'vitest'
import request from 'supertest'
import logRouter from '../routes/log.route'
import * as botDetection from '../utils/bot-detection'
import { createTestApp, setupDatabaseError } from '../test-utils'
import { db } from '../db'

const app = createTestApp('/api/log', logRouter)

vi.mock('../db', () => ({
  db: {
    query: vi.fn()
  }
}))

describe('Log Route', () => {
  beforeAll(() => {
    vi.clearAllMocks()
  })

  function makePostRequest(payload: any) {
    return request(app).post('/api/log').send(payload)
  }

  const invalidPayload = [
    { event: undefined, path: 'test' },
    { event: 'test', path: undefined },
    { event: undefined, path: undefined }
  ]

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
    const response = await makePostRequest({
      event: 'test',
      path: 'test',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ip: '127.0.0.1'
    })
    expect(response.status).toBe(403)
  })

  it('should return 200 if log is successful', async () => {
    const response = await makePostRequest({
      event: 'test',
      path: 'test'
    })
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  })

  it('should return 500 if database throws an error', async () => {
    setupDatabaseError(db)
    const response = await makePostRequest({
      event: 'test',
      path: 'test'
    })
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Internal server error' })
  })
})
