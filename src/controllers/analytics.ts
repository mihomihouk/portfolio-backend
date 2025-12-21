import { Request, Response } from "express"
import { getVisitorCount, getPagePopularity } from "../db/log"

export async function getUserActivityLog(req: Request, res: Response){
    try {
      const daysAgo = req.query.daysAgo ? Number(req.query.daysAgo) : undefined
      const [visitorCount, pagePopularity] = await Promise.all([
        getVisitorCount({ daysAgo }),
        getPagePopularity({ daysAgo })
      ])
      return res.status(200).json({ visitorCount, pagePopularity })
    } catch (err) {
      console.error(`Error getting visitor analytics:`, err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }