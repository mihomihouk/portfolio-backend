import { describe, it, expect } from 'vitest';
import { isBotUser } from './bot-detection';

describe('Bot Detection', () => {
  it('should return true if user agent is a bot', async () => {
    const result = await isBotUser(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      '127.0.0.1'
    );
    expect(result).toBe(true);
  });

  it('should return false if user agent is not a bot', async () => {
    const result = await isBotUser(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '127.0.0.1'
    );
    expect(result).toBe(false);
  });
});
