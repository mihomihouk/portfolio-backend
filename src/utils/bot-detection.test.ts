import { describe, it, expect } from 'vitest'
import { isBotUser } from './bot-detection'

describe('Bot Detection', () => {
  it('should return true if user agent is a bot', async () => {
    const result = await isBotUser(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      '127.0.0.1'
    )
    expect(result).toBe(true)
  })

  it.each([
    ['should return false if ip is not a valid IPv4', '127.0.0.1.1'],
    ['should return false if ip is a privateIP', '192.168.1.1'],
    ['should return false if ip is localhost', '::1']
  ])('%s', async (_testName, ip) => {
    const result = await isBotUser(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ip
    )
    expect(result).toBe(false)
  })
})
