import {
  ALLOWED_REQUEST_STATUS,
  Manager,
  ManagerPartialToken,
  Request,
  RequestPartialStatus,
} from '~/models'

import { RequestsRepository } from './requests'

export type ManagersRepository = {
  getManagers: () => Promise<Manager[]>
  getManagerById: (id: string) => Promise<Manager>
  getManagerByName: (name: string) => Promise<Manager>
  updateToken: (manager: ManagerPartialToken) => Promise<Manager>
  processVacationsRequest: (request: RequestPartialStatus) => Promise<Request>
}

export enum ManagersRepositoryErrors {
  NotFound = 'Manager not found',
  InvalidRequestStatus = 'Invalid request status',
}

export type ManagersRepositoryOptions = {
  requests: RequestsRepository
}

export const mockManagersRepository = (
  managers: Manager[],
  { requests }: ManagersRepositoryOptions,
): ManagersRepository => ({
  getManagers: async () => managers,
  getManagerById: async id => {
    const manager = managers.find(m => m.id === id)

    if (!manager) {
      throw ManagersRepositoryErrors.NotFound
    }

    return manager
  },
  getManagerByName: async name => {
    const manager = managers.find(manager => manager.name === name)

    if (!manager) {
      throw ManagersRepositoryErrors.NotFound
    }

    return manager
  },
  updateToken: async manager => {
    const managerIndex = managers.findIndex(m => m.id === manager.id)

    if (managerIndex === -1) {
      throw ManagersRepositoryErrors.NotFound
    }

    managers[managerIndex].token = manager.token

    return managers[managerIndex]
  },
  processVacationsRequest: async request => {
    if (managers.findIndex(m => m.id === request.resolved_by) === -1) {
      throw ManagersRepositoryErrors.NotFound
    }

    if (!ALLOWED_REQUEST_STATUS.includes(request.status)) {
      throw ManagersRepositoryErrors.InvalidRequestStatus
    }

    return requests.updateRequestStatus(request)
  },
})
