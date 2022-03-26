import { Router } from 'express'

import {
  getManagersController,
  processVacationsRequestController,
} from '~/controllers/managers'
import { allowManagers } from '~/middlewares'
import { repos } from '~/repository'

const router = Router()

router.get('/', allowManagers, getManagersController(repos.managers))
router.put(
  '/request',
  allowManagers,
  processVacationsRequestController(repos.managers),
)

export default router
