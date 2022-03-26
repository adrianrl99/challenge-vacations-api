import anyTest, { TestFn } from 'ava'
import express, { Express } from 'express'
import st from 'supertest'

import { getRequestsController } from '~/controllers/requests'
import {
  mockRequestsRepository,
  RequestsRepository,
} from '~/repository/requests'

const test = anyTest as TestFn<{ app: Express; repo: RequestsRepository }>

test.beforeEach(t => {
  const repo: RequestsRepository = mockRequestsRepository([
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
  ])

  const app = express()

  // Middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  t.context.app = app
  t.context.repo = repo
})

/// Get requests
test('getRequestsController -> it works', async t => {
  t.context.app.get('/', getRequestsController(t.context.repo))
  const response = await st(t.context.app).get('/')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [
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
  ])
})

test('getRequestsController -> empty', async t => {
  t.context.app.get('/', getRequestsController(mockRequestsRepository([])))
  const response = await st(t.context.app).get('/')
  t.is(response.status, 200)
  t.deepEqual(response.body.data, [])
})
