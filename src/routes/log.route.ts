import { Router } from 'express'
import { logUserActivity } from '../controllers/log'

const router = Router()

router.post('/', logUserActivity)

export default router
