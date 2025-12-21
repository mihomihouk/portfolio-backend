import { Router } from 'express'
import { logUserActivity } from '../controllers/log'
import { validateBody } from '../middlewares/validate.middleware'
import { LogEventDTO } from '../dtos/log.dto'

const router = Router()

router.post('/', validateBody(LogEventDTO), logUserActivity)

export default router
