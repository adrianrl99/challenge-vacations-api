import { RequestHandler } from 'express'

import { RequestStatus, toWorkerResult } from '~/models'
import { repos } from '~/repository'
import { RequestRepositoryErrors } from '~/repository/requests'
import { WorkersRepositoryErrors } from '~/repository/workers'

const repo = repos.workers

export const getWorkers: RequestHandler = async (req, res) => {
  try {
    const workers = await repo.getWorkers()
    res.status(200).json({ data: workers.map(toWorkerResult) })
  } catch {
    res.status(500).end()
  }
}

export const getWorker: RequestHandler = async (req, res) => {
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

export const getWorkerRequests: RequestHandler = async (req, res) => {
  try {
    const requests = await repo.getWorkerRequests(req.user.id, {
      status: req.query.status as RequestStatus,
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

export const getWorkerVacations: RequestHandler = async (req, res) => {
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

export const makeVacationsRequest: RequestHandler = async (req, res) => {
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
