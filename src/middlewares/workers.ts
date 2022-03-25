import { RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import config from '~/config'
import { UserToken } from '~/models/auth'
import { repos } from '~/repository'

export const allowWorkers: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (token) {
    try {
      const tokenDecoded = jwt.verify(token, config.SECRET_KEY) as JwtPayload
      const userToken: UserToken = tokenDecoded.data

      if (userToken.type === 'worker') {
        repos.workers.getWorkerById(userToken.id).then(u => {
          if (
            tokenDecoded.exp &&
            tokenDecoded.exp * 1000 > Date.now() &&
            u &&
            u.token === token
          ) {
            req.user = userToken
            next()
          } else {
            res.status(401).send({ error: 'Unauthorized' })
          }
        })
      } else {
        res.status(401).send({ error: 'Unauthorized' })
      }
    } catch {
      res.status(400).send({ error: 'Invalid token' })
    }
  }
}
