import { Router } from 'express'
import { getUserActivityLog } from '../controllers/log'

const router = Router()

router.get('/', getUserActivityLog)

export default router
