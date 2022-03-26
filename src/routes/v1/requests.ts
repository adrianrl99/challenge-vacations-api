import { Router } from 'express'

import { getRequestsController } from '~/controllers/requests'
import { allowManagers } from '~/middlewares'
import { repos } from '~/repository'

const router = Router()

router.get('/', allowManagers, getRequestsController(repos.requests))

export default router
