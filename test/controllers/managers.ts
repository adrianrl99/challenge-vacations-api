import anyTest, { TestFn } from 'ava'
import express, { Express, RequestHandler } from 'express'
import st from 'supertest'

import {
  getManagersController,
  processVacationsRequestController,
} from '~/controllers/managers'
import {
  ManagersRepository,
  mockManagersRepository,
} from '~/repository/managers'
import { mockRequestsRepository } from '~/repository/requests'

const test = anyTest as TestFn<{ app: Express; repo: ManagersRepository }>

const mockMiddlewareManager: RequestHandler = (req, _, next) => {
  req.user = {
    id: '1',
    type: 'manager',
  }
  next()
}

test.beforeEach(t => {
  const repo: ManagersRepository = mockManagersRepository(
    [
      {
        id: '1',
        name: 'manager1',
        password: '!Q2w3e4r',
        created_at: 1647957561003,
        updated_at: 1647957561003,
      },
    ],
    {
      requests: mockRequestsRepository([
        {
          id: '1',
          author: '1',
          status: 'pending',
          resolved_by: '1',
          created_at: 1647957561003,
          updated_at: 1647957561003,
          vacation_start_date: 1647957561003,
          vacation_end_date: 1647957561003,
        },
      ]),
    },
  )

  const app = express()

  // Middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  t.context.app = app
  t.context.repo = repo
})

/// Get managers
test('getManagersController -> it works', async t => {
  t.context.app.get('/', getManagersController(t.context.repo))
  const response = await st(t.context.app).get('/')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [
    {
      id: '1',
      name: 'manager1',
      created_at: 1647957561003,
      updated_at: 1647957561003,
    },
  ])
})

test('getManagersController -> empty', async t => {
  const repo: ManagersRepository = mockManagersRepository([], {
    requests: mockRequestsRepository([]),
  })
  t.context.app.get('/', getManagersController(repo))
  const response = await st(t.context.app).get('/')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [])
})

/// Process vacations request
test('processVacationsRequestController -> it works', async t => {
  t.context.app.use(
    '/',
    mockMiddlewareManager,
    processVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).put('/').send({
    id: '1',
    status: 'approved',
  })
  t.is(response.status, 200)
  t.is(response.body.data.status, 'approved')
})

test('processVacationsRequestController -> manager not found', async t => {
  const mockMiddlewareManager: RequestHandler = (req, _, next) => {
    req.user = {
      id: '2',
      type: 'manager',
    }
    next()
  }
  t.context.app.use(
    '/',
    mockMiddlewareManager,
    processVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).put('/').send({
    id: '1',
    status: 'approved',
  })
  t.is(response.status, 404)
})

test('processVacationsRequestController -> request not found', async t => {
  t.context.app.use(
    '/',
    mockMiddlewareManager,
    processVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).put('/').send({
    id: '2',
    status: 'approved',
  })
  t.is(response.status, 404)
})

test('processVacationsRequestController -> invalid request status', async t => {
  t.context.app.use(
    '/',
    mockMiddlewareManager,
    processVacationsRequestController(t.context.repo),
  )
  const response = await st(t.context.app).put('/').send({
    id: '1',
    status: 'test',
  })
  t.is(response.status, 400)
})
