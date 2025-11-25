import 'dotenv/config';
import dns from 'dns/promises';
const HTTPBL_API_KEY = process.env.HTTPBL_API_KEY;
import crawlers from 'crawler-user-agents';

async function isBotUserAgent(userAgent: string): Promise<boolean> {
  for (const crawler of crawlers) {
    const regex = new RegExp(crawler.pattern, 'i');
    if (regex.test(userAgent)) {
      return true;
    }
  }
  return false;
}

async function isInBotBlackList(ip: string): Promise<boolean> {
  const reversedIp = ip.split('.').reverse().join('.');
  const query = `${HTTPBL_API_KEY}.${reversedIp}.dnsbl.httpbl.org`;
  try {
    const records = await dns.resolve4(query);
    if (!records || records.length === 0) {
      return false;
    }
    return true;
  } catch (err: any) {
    if (err.code === 'ENOTFOUND') {
      // Not listed
      return false;
    }
    console.error('Unexpected DNS error:', err);
    // Treat as not listed for now
    return false;
  }
}

export async function isBotUser(
  userAgent: string,
  ip: string
): Promise<boolean> {
  const _isBotUserAgent = await isBotUserAgent(userAgent);
  const _isInBotBlackList = await isInBotBlackList(ip);
  return _isBotUserAgent || _isInBotBlackList;
}
