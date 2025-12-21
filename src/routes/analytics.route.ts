import { Router } from 'express'
import { getUserActivityLog } from '../controllers/analytics'

const router = Router()

router.get('/', getUserActivityLog)

export default router
