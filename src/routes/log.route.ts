import { Router } from 'express'
import { logUserActivity } from '../controllers/log'
import { validateBody } from '../middlewares/validate.middleware'
import { LogEventDTO } from '../dtos/log.dto'
import { logRateLimiter } from '../middlewares/rate-limit'

const router = Router()

router.post('/', logRateLimiter, validateBody(LogEventDTO), logUserActivity)

export default router
