import mockManagers from '#/managers.json'
import mockRequests from '#/requests.json'
import mockWorkers from '#/workers.json'
import { Manager, Request, Worker } from '~/models'

import { AuthRepository, mockAuthRepository } from './auth'
import { ManagersRepository, mockManagersRepository } from './managers'
import { mockRequestsRepository, RequestsRepository } from './requests'
import { mockWorkersRepository, WorkersRepository } from './workers'

const requests = [...mockRequests] as Request[]
const managers: Manager[] = [...mockManagers]
const workers = [...mockWorkers] as Worker[]

export type Repository = {
  workers: WorkersRepository
  requests: RequestsRepository
  managers: ManagersRepository
  auth: AuthRepository
}

const requestRepository = mockRequestsRepository(requests)

export const repos: Repository = {
  workers: mockWorkersRepository(workers, {
    requests: requestRepository,
  }),
  requests: requestRepository,
  managers: mockManagersRepository(managers, {
    requests: requestRepository,
  }),
  auth: mockAuthRepository({
    repos: {
      managers: mockManagersRepository(managers, {
        requests: requestRepository,
      }),
      workers: mockWorkersRepository(workers, {
        requests: requestRepository,
      }),
    },
  }),
}
