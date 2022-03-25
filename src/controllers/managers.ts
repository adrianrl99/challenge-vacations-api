import { RequestHandler } from 'express'

import { toManagerResult } from '~/models'
import { repos } from '~/repository'
import { ManagersRepositoryErrors } from '~/repository/managers'
import { RequestRepositoryErrors } from '~/repository/requests'

const repo = repos.managers

export const getManagers: RequestHandler = async (req, res) => {
  try {
    const managers = await repo.getManagers()
    res.status(200).json({ data: managers.map(toManagerResult) })
  } catch (error) {
    switch (error) {
      case ManagersRepositoryErrors.NotFound:
        res.status(404).json({ error })
        break
      default:
        res.status(500).end()
    }
  }
}

export const processVacationsRequest: RequestHandler = async (req, res) => {
  try {
    const request = await repo.processVacationsRequest({
      resolved_by: req.user.id,
      id: req.body.id,
      status: req.body.status,
    })
    res.status(200).json({ data: request })
  } catch (error) {
    switch (error) {
      case RequestRepositoryErrors.NotFound:
      case ManagersRepositoryErrors.NotFound:
        res.status(404).json({ error })
        break
      case ManagersRepositoryErrors.InvalidRequestStatus:
        res.status(400).json({ error })
        break
      default:
        res.status(500).end()
    }
  }
}
