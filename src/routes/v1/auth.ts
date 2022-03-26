import { Router } from 'express'

import { signinController } from '~/controllers/auth'
import { repos } from '~/repository'

const router = Router()

router.post('/signin', signinController(repos.auth))

export default router
