import {
  newRequest,
  Request,
  RequestPartialCreate,
  RequestPartialStatus,
  RequestStatus,
} from '~/models'

export type RequestsOptions = {
  status?: RequestStatus
}

export type RequestsRepository = {
  getRequests: (options?: RequestsOptions) => Promise<Request[]>
  getRequestById: (id: string) => Promise<Request>
  getRequestsByWorkerId: (
    id: string,
    options?: RequestsOptions,
  ) => Promise<Request[]>
  setRequest: (request: RequestPartialCreate) => Promise<Request>
  updateRequestStatus: (request: RequestPartialStatus) => Promise<Request>
}

export enum RequestRepositoryErrors {
  InvalidVacation = 'Invalid vacation end date',
  NotFound = 'Request not found',
}

export const mockRequestsRepository = (
  requests: Request[],
): RequestsRepository => ({
  getRequests: async options =>
    requests.filter(r =>
      options?.status ? r.status === options.status : true,
    ),
  getRequestById: async id => {
    const request = requests.find(v => v.id === id)

    if (!request) {
      throw RequestRepositoryErrors.NotFound
    }

    return request
  },
  getRequestsByWorkerId: async (id, options) =>
    requests
      .filter(r => r.author === id)
      .filter(r => (options?.status ? r.status === options.status : true)),
  setRequest: async request => {
    if (request.vacation_end_date <= request.vacation_start_date) {
      throw RequestRepositoryErrors.InvalidVacation
    }

    const newReq = newRequest(request)
    requests.push(newReq)

    return newReq
  },
  updateRequestStatus: async request => {
    const requestIndex = requests.findIndex(v => request.id === v.id)

    if (requestIndex === -1) {
      throw RequestRepositoryErrors.NotFound
    }

    requests[requestIndex].status = request.status
    requests[requestIndex].resolved_by = request.resolved_by
    requests[requestIndex].updated_at = Date.now()

    return requests[requestIndex]
  },
})
