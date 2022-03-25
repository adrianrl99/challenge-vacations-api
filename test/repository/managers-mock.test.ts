import test from 'ava'

import {
  Manager,
  ManagerPartialToken,
  Request,
  RequestPartialStatus,
  RequestStatus,
} from '~/models'
import {
  ManagersRepositoryErrors,
  mockManagersRepository,
} from '~/repository/managers'
import {
  mockRequestsRepository,
  RequestRepositoryErrors,
} from '~/repository/requests'

const mockRequest: Request = {
  id: '1',
  author: '1',
  status: 'pending',
  resolved_by: '1',
  created_at: 1647957561003,
  updated_at: 1647957561003,
  vacation_start_date: 1647957561003,
  vacation_end_date: 1647957561003,
}

const mockManager: Manager = {
  id: '1',
  name: 'manager1',
  password: '!Q2w3e4r',
  created_at: 1647957561003,
  updated_at: 1647957561003,
}

const mockManagerToken: ManagerPartialToken = {
  id: mockManager.id,
  token: 'token',
}

/// Get managers
test('getManagers -> it works', async t => {
  const managers = await mockManagersRepository([mockManager], {
    requests: mockRequestsRepository([]),
  }).getManagers()
  t.deepEqual(managers, [mockManager])
})

test('getManagers -> empty', async t => {
  const managers = await mockManagersRepository([], {
    requests: mockRequestsRepository([]),
  }).getManagers()
  t.deepEqual(managers, [])
})

/// Get manager by Id
test('getManagerById -> it works', async t => {
  const manager = await mockManagersRepository([mockManager], {
    requests: mockRequestsRepository([]),
  }).getManagerById(mockManager.id)
  t.deepEqual(manager, mockManager)
})

test('getManagerById -> manager not found', async t => {
  try {
    await mockManagersRepository([], {
      requests: mockRequestsRepository([]),
    }).getManagerById(mockManager.id)
  } catch (error) {
    t.is(error, ManagersRepositoryErrors.NotFound)
  }
})

/// Get manager by name
test('getManagerByName -> it works', async t => {
  const manager = await mockManagersRepository([mockManager], {
    requests: mockRequestsRepository([]),
  }).getManagerByName(mockManager.name)
  t.deepEqual(manager, mockManager)
})

test('getManagerByName -> manager not found', async t => {
  try {
    await mockManagersRepository([], {
      requests: mockRequestsRepository([]),
    }).getManagerByName(mockManager.name)
  } catch (error) {
    t.is(error, ManagersRepositoryErrors.NotFound)
  }
})

/// Update manager token
test('updateToken -> it works', async t => {
  const mockManagers: Manager[] = [mockManager]
  const manager = await mockManagersRepository(mockManagers, {
    requests: mockRequestsRepository([]),
  }).updateToken(mockManagerToken)

  t.deepEqual(manager, {
    ...mockManagers[0],
    token: mockManagerToken.token,
  })
})

test('updateToken -> manager not found', async t => {
  try {
    await mockManagersRepository([], {
      requests: mockRequestsRepository([]),
    }).updateToken(mockManagerToken)
  } catch (error) {
    t.is(error, ManagersRepositoryErrors.NotFound)
  }
})

/// Process vacations request
test('processVacationRequest -> it works', async t => {
  const mockRequests: Request[] = [mockRequest]
  const mockRequestStatus: RequestPartialStatus = {
    id: mockRequest.id,
    resolved_by: mockManager.id,
    status: 'approved',
  }
  const request = await mockManagersRepository([mockManager], {
    requests: mockRequestsRepository(mockRequests),
  }).processVacationsRequest(mockRequestStatus)

  t.is(request.resolved_by, mockRequestStatus.resolved_by)
  t.is(request.status, mockRequestStatus.status)

  t.deepEqual(mockRequests, [request])
})

test('processVacationRequest -> manager not found', async t => {
  const mockRequestStatus: RequestPartialStatus = {
    id: mockRequest.id,
    resolved_by: '-1',
    status: 'approved',
  }

  try {
    await mockManagersRepository([mockManager], {
      requests: mockRequestsRepository([mockRequest]),
    }).processVacationsRequest(mockRequestStatus)
  } catch (error) {
    t.is(error, ManagersRepositoryErrors.NotFound)
  }
})

test('processVacationRequest -> invalid request status', async t => {
  const mockRequestStatus: RequestPartialStatus = {
    id: mockRequest.id,
    resolved_by: mockManager.id,
    status: 'test' as RequestStatus,
  }
  try {
    await mockManagersRepository([mockManager], {
      requests: mockRequestsRepository([mockRequest]),
    }).processVacationsRequest(mockRequestStatus)
  } catch (error) {
    t.is(error, ManagersRepositoryErrors.InvalidRequestStatus)
  }
})

test('processVacationRequest -> request not found', async t => {
  const mockRequestStatus: RequestPartialStatus = {
    id: mockRequest.id,
    resolved_by: mockManager.id,
    status: 'approved',
  }

  try {
    await mockManagersRepository([mockManager], {
      requests: mockRequestsRepository([]),
    }).processVacationsRequest(mockRequestStatus)
  } catch (error) {
    t.is(error, RequestRepositoryErrors.NotFound)
  }
})
