import { Router } from 'express'

import {
  getWorker,
  getWorkerRequests,
  getWorkers,
  getWorkerVacations,
  makeVacationsRequest,
} from '~/controllers/workers'
import { allowManagers } from '~/middlewares'
import { allowWorkers } from '~/middlewares/workers'

const router = Router()

router.get('/', allowManagers, getWorkers)
router.get('/:name', allowManagers, getWorker)
router.get('/:name/requests', allowWorkers, getWorkerRequests)
router.get('/:name/vacations', allowWorkers, getWorkerVacations)
router.put('/:name/vacations', allowWorkers, makeVacationsRequest)

export default router
