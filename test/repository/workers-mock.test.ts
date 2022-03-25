import test from 'ava'

import {
  Request,
  Worker,
  WorkerPartialToken,
  WorkerPartialVacation,
} from '~/models'
import {
  mockRequestsRepository,
  RequestRepositoryErrors,
} from '~/repository/requests'
import {
  mockWorkersRepository,
  WorkersRepositoryErrors,
} from '~/repository/workers'

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

const mockWorker: Worker = {
  id: '1',
  name: 'worker1',
  password: '!Q2w3e4r',
  remaining_vacations: 30,
  created_at: 1647957561003,
  updated_at: 1647957561003,
}

const mockWorkerToken: WorkerPartialToken = {
  id: mockWorker.id,
  token: 'token',
}

/// Get workers
test('getWorkers -> it works', async t => {
  const workers = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([]),
  }).getWorkers()
  t.deepEqual(workers, [mockWorker])
})

test('getWorkers -> empty', async t => {
  const workers = await mockWorkersRepository([], {
    requests: mockRequestsRepository([]),
  }).getWorkers()
  t.deepEqual(workers, [])
})

/// Get worker by id
test('getWorkerById -> it works', async t => {
  const worker = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([]),
  }).getWorkerById(mockWorker.id)
  t.deepEqual(worker, mockWorker)
})

test('getWorkerById -> worker not found', async t => {
  try {
    await mockWorkersRepository([], {
      requests: mockRequestsRepository([]),
    }).getWorkerById(mockWorker.id)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

/// Get worker by name
test('getWorkerByName -> it works', async t => {
  const worker = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([]),
  }).getWorkerByName(mockWorker.name)
  t.deepEqual(worker, mockWorker)
})

test('getWorkerByName -> worker not found', async t => {
  try {
    await mockWorkersRepository([], {
      requests: mockRequestsRepository([]),
    }).getWorkerByName(mockWorker.name)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

/// Get worker vacations
test('getWorkerVacations -> it works', async t => {
  const remaining_vacations = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([]),
  }).getWorkerVacations(mockWorker.id)
  t.is(remaining_vacations, mockWorker.remaining_vacations)
})

test('getWorkerVacations -> worker not found', async t => {
  try {
    await mockWorkersRepository([], {
      requests: mockRequestsRepository([]),
    }).getWorkerVacations(mockWorker.id)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

test('getWorkerRequests -> it works', async t => {
  const requests = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([mockRequest]),
  }).getWorkerRequests(mockWorker.id)
  t.deepEqual(requests, [mockRequest])
})

test('getWorkerRequests -> filtered by status', async t => {
  const requests = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([mockRequest]),
  }).getWorkerRequests(mockWorker.id, {
    status: 'pending',
  })
  t.deepEqual(requests, [mockRequest])
})

test('getWorkerRequests -> filtered by status empty', async t => {
  const requests = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([]),
  }).getWorkerRequests(mockWorker.id, {
    status: 'pending',
  })
  t.deepEqual(requests, [])
})

test('getWorkerRequests -> filtered by status that has no worker requests', async t => {
  const requests = await mockWorkersRepository([mockWorker], {
    requests: mockRequestsRepository([mockRequest]),
  }).getWorkerRequests(mockWorker.id, {
    status: 'approved',
  })
  t.deepEqual(requests, [])
})

test('getWorkerRequests -> worker not found', async t => {
  try {
    await mockWorkersRepository([], {
      requests: mockRequestsRepository([]),
    }).getWorkerRequests(mockWorker.id)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

/// Update worker token
test('updateToken -> it works', async t => {
  const mockWorkers: Worker[] = [mockWorker]
  const worker = await mockWorkersRepository(mockWorkers, {
    requests: mockRequestsRepository([]),
  }).updateToken(mockWorkerToken)

  t.deepEqual(worker, {
    ...mockWorkers[0],
    token: mockWorkerToken.token,
  })
})

test('updateToken -> worker not found', async t => {
  try {
    await mockWorkersRepository([], {
      requests: mockRequestsRepository([]),
    }).updateToken(mockWorkerToken)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

/// Update worker vacations
test('updateVacations -> it works', async t => {
  const mockRequests: Request[] = []
  const mockWorkers: Worker[] = [{ ...mockWorker }]
  const mockWorkerVacation: WorkerPartialVacation = {
    id: mockWorker.id,
    vacation_end_date: Date.now() + 1000 * 60 * 60 * 24 * 7, /// 7 days more
    vacation_start_date: Date.now(),
  }
  const request = await mockWorkersRepository(mockWorkers, {
    requests: mockRequestsRepository(mockRequests),
  }).updateVacations(mockWorkerVacation)

  t.is(request.status, 'pending')
  t.is(request.vacation_start_date, mockWorkerVacation.vacation_start_date)
  t.is(request.vacation_end_date, mockWorkerVacation.vacation_end_date)
  t.is(request.author, mockWorker.id)
  t.is(mockWorkers[0].remaining_vacations, 23)

  t.deepEqual(mockRequests, [request])
})

test('updateVacations -> worker not found', async t => {
  const mockWorkerVacation: WorkerPartialVacation = {
    id: mockWorker.id,
    vacation_end_date: Date.now() + 1000 * 60 * 60 * 24 * 7, /// 7 days more
    vacation_start_date: Date.now(),
  }
  try {
    await mockWorkersRepository([], {
      requests: mockRequestsRepository([]),
    }).updateVacations(mockWorkerVacation)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

test('updateVacations -> vacation_end_date is before vacation_start_date', async t => {
  const mockWorkerVacation: WorkerPartialVacation = {
    id: mockWorker.id,
    vacation_end_date: Date.now() - 1000 * 60 * 60 * 24 * 7, /// 7 days less
    vacation_start_date: Date.now(),
  }
  try {
    await mockWorkersRepository([{ ...mockWorker }], {
      requests: mockRequestsRepository([]),
    }).updateVacations(mockWorkerVacation)
  } catch (error) {
    t.is(error, RequestRepositoryErrors.InvalidVacation)
  }
})

test('updateVacations -> insufficient vacations', async t => {
  const mockWorkerVacation: WorkerPartialVacation = {
    id: mockWorker.id,
    vacation_end_date: Date.now() + 1000 * 60 * 60 * 24 * 31, /// 31 days more
    vacation_start_date: Date.now(),
  }
  try {
    await mockWorkersRepository([{ ...mockWorker }], {
      requests: mockRequestsRepository([]),
    }).updateVacations(mockWorkerVacation)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.InsufficientRemainingVacations)
  }
})
