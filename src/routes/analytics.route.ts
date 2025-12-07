import { Router } from 'express'
import { getVisitorCount, getPagePopularity } from '../db/log'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const daysAgo = req.query.daysAgo ? Number(req.query.daysAgo) : undefined
    const [visitorCount, pagePopularity] = await Promise.all([
      getVisitorCount({ daysAgo }),
      getPagePopularity({ daysAgo })
    ])
    //   console.log(visitorCount, pagePopularity)
    return res.status(200).json({ visitorCount, pagePopularity })
  } catch (err) {
    console.error(`Error getting visitor analytics:`, err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
