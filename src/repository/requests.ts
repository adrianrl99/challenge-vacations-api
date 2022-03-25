import {
  newRequest,
  Request,
  RequestPartialCreate,
  RequestPartialStatus,
  RequestStatus,
} from '~/models'

export type RequestsOptions = {
  status?: RequestStatus
  range?: {
    start_date: string | number | Date
    end_date: string | number | Date
  }
  month?: number
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

export type FilterRequestsByOptions = (
  requests: Request[],
  options?: RequestsOptions,
) => Request[]
const filterRequestsByOptions: FilterRequestsByOptions = (requests, options) =>
  !options
    ? requests
    : requests
        .filter(r => (options.status ? r.status === options.status : true))
        .filter(r =>
          !options.month
            ? true
            : new Date(r.vacation_start_date).getMonth() ===
                options.month - 1 ||
              new Date(r.vacation_end_date).getMonth() === options.month - 1,
        )
        .filter(r =>
          !options.range ||
          (!options.range.start_date && !options.range.end_date)
            ? true
            : (new Date(r.vacation_start_date).getTime() >=
                new Date(options.range.start_date).getTime() &&
                new Date(r.vacation_start_date).getTime() <=
                  new Date(options.range.end_date).getTime()) ||
              (new Date(r.vacation_end_date).getTime() >=
                new Date(options.range.start_date).getTime() &&
                new Date(r.vacation_end_date).getTime() <=
                  new Date(options.range.end_date).getTime()),
        )

export const mockRequestsRepository = (
  requests: Request[],
): RequestsRepository => ({
  getRequests: async options => filterRequestsByOptions(requests, options),
  getRequestById: async id => {
    const request = requests.find(v => v.id === id)

    if (!request) {
      throw RequestRepositoryErrors.NotFound
    }

    return request
  },
  getRequestsByWorkerId: async (id, options) =>
    filterRequestsByOptions(
      requests.filter(r => r.author === id),
      options,
    ),
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
