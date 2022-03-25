import { Router } from 'express'

import { getRequests } from '~/controllers/requests'
import { allowManagers } from '~/middlewares'

const router = Router()

router.get('/', allowManagers, getRequests)

export default router
