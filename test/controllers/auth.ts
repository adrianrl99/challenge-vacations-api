import anyTest, { TestFn } from 'ava'
import express, { Express } from 'express'
import st from 'supertest'

import { signinController } from '~/controllers/auth'
import { AuthRepository, mockAuthRepository } from '~/repository/auth'
import { mockManagersRepository } from '~/repository/managers'
import { mockRequestsRepository } from '~/repository/requests'
import { mockWorkersRepository } from '~/repository/workers'

const test = anyTest as TestFn<{ app: Express; repo: AuthRepository }>

test.beforeEach(t => {
  const requestRepository = mockRequestsRepository([])
  const repo: AuthRepository = mockAuthRepository({
    repos: {
      managers: mockManagersRepository(
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
          requests: requestRepository,
        },
      ),
      workers: mockWorkersRepository(
        [
          {
            id: '1',
            name: 'worker1',
            password: '!Q2w3e4r',
            remaining_vacations: 30,
            created_at: 1647957561003,
            updated_at: 1647957561003,
          },
        ],
        {
          requests: requestRepository,
        },
      ),
    },
  })
  const app = express()

  // Middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  t.context.app = app
  t.context.repo = repo
})

test('signinController -> it works (worker)', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'worker1',
    password: '!Q2w3e4r',
    type: 'worker',
  })

  t.is(response.status, 200)
  t.truthy(response.header['x-authtoken'])
})

test('signinController -> invalid credentiasl (name) (worker)', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'worker',
    password: '!Q2w3e4r',
    type: 'worker',
  })

  t.is(response.status, 401)
})

test('signinController -> invalid credentiasl (password) (worker)', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'worker1',
    password: '!Q2w3e4',
    type: 'worker',
  })

  t.is(response.status, 401)
})

test('signinController -> it works (manager)', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'manager1',
    password: '!Q2w3e4r',
    type: 'manager',
  })

  t.is(response.status, 200)
  t.truthy(response.header['x-authtoken'])
})

test('signinController -> invalid credentiasl (name) (manager)', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'manager',
    password: '!Q2w3e4r',
    type: 'manager',
  })

  t.is(response.status, 401)
})

test('signinController -> invalid credentiasl (password) (manager) ', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'manager1',
    password: '!Q2w3e4',
    type: 'manager',
  })

  t.is(response.status, 401)
})

test('signinController -> unkown user type', async t => {
  t.context.app.post('/', signinController(t.context.repo))
  const response = await st(t.context.app).post('/').send({
    name: 'manager1',
    password: '!Q2w3e4',
    type: 'test',
  })

  t.is(response.status, 400)
})
