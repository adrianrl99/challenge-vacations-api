import {
  Request,
  RequestStatus,
  Worker,
  WorkerPartialToken,
  WorkerPartialVacation,
} from '~/models'
import { diffDates } from '~/utils/helpers'

import { RequestsRepository } from './requests'

export type GetWorkerRequestsOptions = {
  status?: RequestStatus
}

export type WorkersRepository = {
  getWorkers: () => Promise<Worker[]>
  getWorkerById: (id: string) => Promise<Worker>
  getWorkerByName: (name: string) => Promise<Worker>
  getWorkerVacations: (id: string) => Promise<number>
  getWorkerRequests: (
    id: string,
    options?: GetWorkerRequestsOptions,
  ) => Promise<Request[]>
  updateToken: (worker: WorkerPartialToken) => Promise<Worker>
  updateVacations: (vacation: WorkerPartialVacation) => Promise<Request>
}

export enum WorkersRepositoryErrors {
  NotFound = 'Worker not found',
  InsufficientRemainingVacations = 'insufficient remaining vacations',
}

export type WorkersRepositoryOptions = {
  requests: RequestsRepository
}

export const mockWorkersRepository = (
  workers: Worker[],
  { requests }: WorkersRepositoryOptions,
): WorkersRepository => ({
  getWorkers: async () => workers,
  getWorkerById: async id => {
    const worker = workers.find(worker => worker.id === id)

    if (!worker) {
      throw WorkersRepositoryErrors.NotFound
    }

    return worker
  },
  getWorkerByName: async name => {
    const worker = workers.find(worker => worker.name === name)

    if (!worker) {
      throw WorkersRepositoryErrors.NotFound
    }

    return worker
  },
  getWorkerVacations: async id => {
    const worker = workers.find(worker => worker.id === id)

    if (!worker) {
      throw WorkersRepositoryErrors.NotFound
    }

    return worker.remaining_vacations
  },
  getWorkerRequests: async (id, options) => {
    const worker = workers.find(worker => worker.id === id)

    if (!worker) {
      throw WorkersRepositoryErrors.NotFound
    }

    return requests.getRequestsByWorkerId(worker.id, {
      status: options?.status,
    })
  },
  updateToken: async worker => {
    const workerIndex = workers.findIndex(w => w.id === worker.id)

    if (workerIndex === -1) {
      throw WorkersRepositoryErrors.NotFound
    }

    workers[workerIndex].token = worker.token

    return workers[workerIndex]
  },
  updateVacations: async (vacation: WorkerPartialVacation) => {
    const workerIndex = workers.findIndex(w => w.id === vacation.id)

    if (workerIndex === -1) {
      throw WorkersRepositoryErrors.NotFound
    }

    const request = await requests.setRequest({
      author: workers[workerIndex].id,
      ...vacation,
    })

    const remaining_vacations = workers[workerIndex].remaining_vacations
    const diff = diffDates(
      vacation.vacation_start_date,
      vacation.vacation_end_date,
    )

    if (diff > remaining_vacations) {
      throw WorkersRepositoryErrors.InsufficientRemainingVacations
    }
    workers[workerIndex].remaining_vacations -= diff

    return request
  },
})
