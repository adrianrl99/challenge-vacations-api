import anyTest, { TestFn } from 'ava'
import express, { Express, RequestHandler } from 'express'
import st from 'supertest'

import {
  getWorkerController,
  getWorkerRequestsController,
  getWorkersController,
  getWorkerVacationsController,
  makeVacationsRequestController,
} from '~/controllers/workers'
import { Request, Worker, WorkerResult } from '~/models'
import { mockRequestsRepository } from '~/repository/requests'
import { mockWorkersRepository, WorkersRepository } from '~/repository/workers'

const test = anyTest as TestFn<{ app: Express; repo: WorkersRepository }>

const mockWorkerResult: WorkerResult = {
  id: '1',
  name: 'worker1',
  remaining_vacations: 30,
  created_at: 1647957561003,
  updated_at: 1647957561003,
}

const mockWorker: Worker = {
  id: '1',
  name: 'worker1',
  password: '!Q2w3e4r',
  remaining_vacations: 30,
  created_at: 1647957561003,
  updated_at: 1647957561003,
}

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

const mockMiddlewareWorker: RequestHandler = (req, _, next) => {
  req.user = {
    id: '1',
    type: 'worker',
  }
  next()
}

test.beforeEach(t => {
  const repo: WorkersRepository = mockWorkersRepository([{ ...mockWorker }], {
    requests: mockRequestsRepository([{ ...mockRequest }]),
  })

  const app = express()

  // Middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  t.context.app = app
  t.context.repo = repo
})

/// Get workers
test('getWorkersController -> it works', async t => {
  t.context.app.get('/', getWorkersController(t.context.repo))
  const response = await st(t.context.app).get('/')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [mockWorkerResult])
})

test('getWorkersController -> empty', async t => {
  t.context.app.get(
    '/',
    getWorkersController(
      mockWorkersRepository([], {
        requests: mockRequestsRepository([]),
      }),
    ),
  )
  const response = await st(t.context.app).get('/')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [])
})

/// Get worker
test('getWorkerController -> it works', async t => {
  t.context.app.get('/:name', getWorkerController(t.context.repo))
  const response = await st(t.context.app).get('/worker1')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, mockWorkerResult)
})

test('getWorkerController -> worker not found', async t => {
  t.context.app.get('/:name', getWorkerController(t.context.repo))
  const response = await st(t.context.app).get('/worker')
  t.is(response.status, 404)
})

/// Get worker requests
test('getWorkerRequestsController -> it works', async t => {
  t.context.app.get(
    '/:name',
    mockMiddlewareWorker,
    getWorkerRequestsController(t.context.repo),
  )
  const response = await st(t.context.app).get('/worker1')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [{ ...mockRequest }])
})

test('getWorkerRequestsController -> worker not found', async t => {
  t.context.app.get(
    '/:name',
    mockMiddlewareWorker,
    getWorkerRequestsController(
      mockWorkersRepository([{ ...mockWorker, id: '2' }], {
        requests: mockRequestsRepository([]),
      }),
    ),
  )
  const response = await st(t.context.app).get('/worker1')
  t.is(response.status, 404)
})

test('getWorkerRequestsController -> empty', async t => {
  t.context.app.get(
    '/:name',
    mockMiddlewareWorker,
    getWorkerRequestsController(
      mockWorkersRepository([{ ...mockWorker }], {
        requests: mockRequestsRepository([]),
      }),
    ),
  )
  const response = await st(t.context.app).get('/worker1')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [])
})

/// Get worker vacations
test('getWorkerVacationsController -> it works', async t => {
  t.context.app.get(
    '/:name',
    mockMiddlewareWorker,
    getWorkerVacationsController(t.context.repo),
  )
  const response = await st(t.context.app).get('/worker1')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, 30)
})

test('getWorkerVacationsController -> worker not found', async t => {
  t.context.app.get(
    '/:name',
    mockMiddlewareWorker,
    getWorkerVacationsController(
      mockWorkersRepository([{ ...mockWorker, id: '2' }], {
        requests: mockRequestsRepository([]),
      }),
    ),
  )
  const response = await st(t.context.app).get('/worker1')
  t.is(response.status, 404)
})

/// Make vacations request
test('makeVacationsRequestController -> it works', async t => {
  const vacation_start_date = Date.now()
  const vacation_end_date = Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days more
  t.context.app.post(
    '/',
    mockMiddlewareWorker,
    makeVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).post('/').send({
    id: '1',
    vacation_start_date,
    vacation_end_date,
  })
  const data = response.body.data

  t.is(response.status, 200)
  t.is(data.author, mockWorker.id)
  t.is(data.vacation_start_date, vacation_start_date)
  t.is(data.vacation_end_date, vacation_end_date)
  t.is(data.status, 'pending')
})

test('makeVacationsRequestController -> worker not found', async t => {
  const vacation_start_date = Date.now()
  const vacation_end_date = Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days more
  t.context.app.post(
    '/',
    mockMiddlewareWorker,
    makeVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).post('/').send({
    id: '2',
    vacation_start_date,
    vacation_end_date,
  })

  t.is(response.status, 404)
})

test('makeVacationsRequestController -> invalid vacation', async t => {
  const vacation_end_date = Date.now()
  const vacation_start_date = Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days more
  t.context.app.post(
    '/',
    mockMiddlewareWorker,
    makeVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).post('/').send({
    id: '1',
    vacation_start_date,
    vacation_end_date,
  })

  t.is(response.status, 400)
})

test('makeVacationsRequestController -> insufficient remaining vacations', async t => {
  const vacation_end_date = Date.now()
  const vacation_start_date = Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days more
  t.context.app.post(
    '/',
    mockMiddlewareWorker,
    makeVacationsRequestController(
      mockWorkersRepository([{ ...mockWorker, remaining_vacations: 0 }], {
        requests: mockRequestsRepository([]),
      }),
    ),
  )
  const response = await st(t.context.app).post('/').send({
    id: '1',
    vacation_start_date,
    vacation_end_date,
  })

  t.is(response.status, 400)
})
