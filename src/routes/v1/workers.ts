import { Router } from 'express'

import {
  getWorkerController,
  getWorkerRequestsController,
  getWorkersController,
  getWorkerVacationsController,
  makeVacationsRequestController,
} from '~/controllers/workers'
import { allowManagers } from '~/middlewares'
import { allowWorkers } from '~/middlewares/workers'
import { repos } from '~/repository'

const router = Router()

router.get('/', allowManagers, getWorkersController(repos.workers))
router.get('/:name', allowManagers, getWorkerController(repos.workers))
router.get(
  '/:name/requests',
  allowWorkers,
  getWorkerRequestsController(repos.workers),
)
router.get(
  '/:name/vacations',
  allowWorkers,
  getWorkerVacationsController(repos.workers),
)
router.put(
  '/:name/vacations',
  allowWorkers,
  makeVacationsRequestController(repos.workers),
)

export default router
