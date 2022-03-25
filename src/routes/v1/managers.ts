import { Router } from 'express'

import { getManagers, processVacationsRequest } from '~/controllers/managers'
import { allowManagers } from '~/middlewares'

const router = Router()

router.get('/', allowManagers, getManagers)
router.put('/request', allowManagers, processVacationsRequest)

export default router
