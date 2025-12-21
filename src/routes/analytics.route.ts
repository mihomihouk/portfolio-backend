import { Router } from 'express'
import { getUserActivityLog } from '../controllers/log'
import { validateQuery } from '../middlewares/validate.middleware'
import { GetUserActivityLogDTO } from '../dtos/log.dto'

const router = Router()

router.get('/', validateQuery(GetUserActivityLogDTO), getUserActivityLog)

export default router
