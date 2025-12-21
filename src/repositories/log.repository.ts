import { db } from '../db/index'

export class LogRepository {
  async logEvent({
    event,
    path,
    referrer,
    userAgent,
    ip
  }: {
    event: string
    path: string
    referrer?: string
    userAgent: string
    ip?: string
  }) {
    await db.query(
      `
    INSERT INTO logs (event, path, referrer, user_agent, ip)
    VALUES ($1, $2, $3, $4, $5)
    `,
      [event, path, referrer, userAgent, ip || null]
    )
  }

  async getVisitorCount({ daysAgo }: { daysAgo: number }) {
    const result = await db.query(
      `
    SELECT 
        COUNT(id) AS visits,
        DATE(created_at) AS date
    FROM logs
    WHERE event = 'page_view'
      AND path = '/'
      AND created_at >= NOW() - ($1 || ' days')::interval
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
    `,
      [daysAgo]
    )

    return result.rows
  }

  async getPagePopularity({ daysAgo }: { daysAgo: number }) {
    const result = await db.query(
      `
    SELECT
        COUNT(id) AS visits,
        path AS page
    FROM logs
    WHERE event = 'page_view'
      AND created_at >= NOW() - ($1 || ' days')::interval
    GROUP BY path
    ORDER BY visits DESC
    `,
      [daysAgo]
    )

    return result.rows
  }
}
