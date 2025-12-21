import { vi, Mocked } from 'vitest'
import { LogRepository } from '../../src/repositories/log.repository'

export function createMockLogRepository(): Mocked<LogRepository> {
  return {
    logEvent: vi.fn(),
    getVisitorCount: vi.fn(),
    getPagePopularity: vi.fn()
  }
}
