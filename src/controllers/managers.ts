import { RequestHandler } from 'express'

import { toManagerResult } from '~/models'
import {
  ManagersRepository,
  ManagersRepositoryErrors,
} from '~/repository/managers'
import { RequestRepositoryErrors } from '~/repository/requests'

export type GetManagersController = (repo: ManagersRepository) => RequestHandler
export const getManagersController: GetManagersController =
  repo => async (req, res) => {
    try {
      const managers = await repo.getManagers()
      res.status(200).json({ data: managers.map(toManagerResult) })
    } catch {
      res.status(500).end()
    }
  }

export type ProcessVacationsRequestController = (
  repo: ManagersRepository,
) => RequestHandler
export const processVacationsRequestController: ProcessVacationsRequestController =
  repo => async (req, res) => {
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
