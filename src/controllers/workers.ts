import { RequestHandler } from 'express'

import { RequestStatus, toWorkerResult } from '~/models'
import { RequestRepositoryErrors } from '~/repository/requests'
import {
  WorkersRepository,
  WorkersRepositoryErrors,
} from '~/repository/workers'

export type GetWorkersController = (repo: WorkersRepository) => RequestHandler
export const getWorkersController: GetWorkersController =
  repo => async (req, res) => {
    try {
      const workers = await repo.getWorkers()
      res.status(200).json({ data: workers.map(toWorkerResult) })
    } catch {
      res.status(500).end()
    }
  }

export type GetWorkerController = (repo: WorkersRepository) => RequestHandler
export const getWorkerController: GetWorkerController =
  repo => async (req, res) => {
    try {
      const worker = await repo.getWorkerByName(req.params.name)
      res.status(200).json({ data: toWorkerResult(worker) })
    } catch (error) {
      switch (error) {
        case WorkersRepositoryErrors.NotFound:
          res.status(404).json({ error })
          break
        default:
          res.status(500).end()
      }
    }
  }

export type GetWorkerRequestsController = (
  repo: WorkersRepository,
) => RequestHandler
export const getWorkerRequestsController: GetWorkerRequestsController =
  repo => async (req, res) => {
    try {
      const requests = await repo.getWorkerRequests(req.user.id, {
        status: req.query.status as RequestStatus,
        month: Number(req.query.month),
        range: {
          start_date: req.query.start_date as string | number,
          end_date: req.query.end_date as string | number,
        },
      })

      res.status(200).json({ data: requests })
    } catch (error) {
      switch (error) {
        case WorkersRepositoryErrors.NotFound:
          res.status(404).json({ error })
          break
        default:
          res.status(500).end()
      }
    }
  }

export type GetWorkerVacationsController = (
  repo: WorkersRepository,
) => RequestHandler
export const getWorkerVacationsController: GetWorkerVacationsController =
  repo => async (req, res) => {
    try {
      const vacations = await repo.getWorkerVacations(req.user.id)
      res.status(200).json({ data: vacations })
    } catch (error) {
      switch (error) {
        case WorkersRepositoryErrors.NotFound:
          res.status(404).json({ error })
          break
        default:
          res.status(500).end()
      }
    }
  }

export type MakeVacationsRequestController = (
  repo: WorkersRepository,
) => RequestHandler
export const makeVacationsRequestController: MakeVacationsRequestController =
  repo => async (req, res) => {
    try {
      const remaining = await repo.updateVacations(req.body)
      res.status(200).json({ data: remaining })
    } catch (error) {
      switch (error) {
        case WorkersRepositoryErrors.NotFound:
          res.status(404).json({ error })
          break
        case RequestRepositoryErrors.InvalidVacation:
        case WorkersRepositoryErrors.InsufficientRemainingVacations:
          res.status(400).json({ error })
          break
        default:
          res.status(500).end()
      }
    }
  }
