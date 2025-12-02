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

function isValidIPv4(ip: string): boolean {
  // Check if it's a valid IPv4 format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) {
    return false;
  }

  // Validate each octet is 0-255
  const octets = ip.split('.');
  return octets.every((octet) => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

function isPrivateOrLocalIP(ip: string): boolean {
  // Localhost
  if (ip === '127.0.0.1' || ip.startsWith('127.')) {
    return true;
  }

  // Private networks
  if (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)
  ) {
    return true;
  }

  return false;
}

async function isInBotBlackList(ip: string): Promise<boolean> {
  const reversedIp = ip.split('.').reverse().join('.');
  const query = `${HTTPBL_API_KEY}.${reversedIp}.dnsbl.httpbl.org`;
  if (!isValidIPv4(ip) || isPrivateOrLocalIP(ip) || !HTTPBL_API_KEY) {
    return false;
  }
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
