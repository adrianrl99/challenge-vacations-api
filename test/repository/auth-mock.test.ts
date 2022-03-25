import test from 'ava'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { Manager, Worker } from '~/models'
import { SignInData, UserToken } from '~/models/auth'
import { AuthRepositoryErrors, mockAuthRepository } from '~/repository/auth'
import {
  ManagersRepositoryErrors,
  mockManagersRepository,
} from '~/repository/managers'
import { mockRequestsRepository } from '~/repository/requests'
import {
  mockWorkersRepository,
  WorkersRepositoryErrors,
} from '~/repository/workers'

const requests = mockRequestsRepository([])

const mockWorker: Worker = {
  id: '1',
  name: 'worker1',
  password: '!Q2w3e4r',
  remaining_vacations: 30,
  created_at: 1647957561003,
  updated_at: 1647957561003,
}

const mockManager: Manager = {
  id: '1',
  name: 'manager1',
  password: '!Q2w3e4r',
  created_at: 1647957561003,
  updated_at: 1647957561003,
}

/// Signin
test('signin -> it works (manager)', async t => {
  const data: SignInData = {
    name: 'manager1',
    password: '!Q2w3e4r',
    type: 'manager',
  }
  const token = await mockAuthRepository({
    repos: {
      managers: mockManagersRepository([{ ...mockManager }], {
        requests,
      }),
      workers: mockWorkersRepository([{ ...mockWorker }], {
        requests,
      }),
    },
  }).signin(data)
  const decoded = jwt.decode(token) as JwtPayload
  const userToken: UserToken = decoded.data
  t.is(userToken.type, 'manager')
  t.is(userToken.id, mockManager.id)
})

test('signin -> it works (worker)', async t => {
  const data: SignInData = {
    name: 'worker1',
    password: '!Q2w3e4r',
    type: 'worker',
  }
  const token = await mockAuthRepository({
    repos: {
      managers: mockManagersRepository([{ ...mockManager }], {
        requests,
      }),
      workers: mockWorkersRepository([{ ...mockWorker }], {
        requests,
      }),
    },
  }).signin(data)
  const decoded = jwt.decode(token) as JwtPayload
  const userToken: UserToken = decoded.data
  t.is(userToken.type, 'worker')
  t.is(userToken.id, mockWorker.id)
})

test('signin -> unknown user type', async t => {
  const data: SignInData = {
    name: 'worker1',
    password: '!Q2w3e4r',
    type: 'test' as 'worker',
  }
  try {
    await mockAuthRepository({
      repos: {
        managers: mockManagersRepository([{ ...mockManager }], {
          requests,
        }),
        workers: mockWorkersRepository([{ ...mockWorker }], {
          requests,
        }),
      },
    }).signin(data)
  } catch (error) {
    t.is(error, AuthRepositoryErrors.UnknownUserType)
  }
})

test('signin -> invalid credentials (name) (worker)', async t => {
  const data: SignInData = {
    name: 'worker',
    password: '!Q2w3e4r',
    type: 'worker',
  }
  try {
    await mockAuthRepository({
      repos: {
        managers: mockManagersRepository([{ ...mockManager }], {
          requests,
        }),
        workers: mockWorkersRepository([{ ...mockWorker }], {
          requests,
        }),
      },
    }).signin(data)
  } catch (error) {
    t.is(error, WorkersRepositoryErrors.NotFound)
  }
})

test('signin -> invalid credentials (name) (manager)', async t => {
  const data: SignInData = {
    name: 'manager',
    password: '!Q2w3e4r',
    type: 'manager',
  }
  try {
    await mockAuthRepository({
      repos: {
        managers: mockManagersRepository([{ ...mockManager }], {
          requests,
        }),
        workers: mockWorkersRepository([{ ...mockWorker }], {
          requests,
        }),
      },
    }).signin(data)
  } catch (error) {
    t.is(error, ManagersRepositoryErrors.NotFound)
  }
})

test('signin -> invalid credentials (password)', async t => {
  const data: SignInData = {
    name: 'manager1',
    password: '!Q2w3e4',
    type: 'manager',
  }
  try {
    await mockAuthRepository({
      repos: {
        managers: mockManagersRepository([{ ...mockManager }], {
          requests,
        }),
        workers: mockWorkersRepository([{ ...mockWorker }], {
          requests,
        }),
      },
    }).signin(data)
  } catch (error) {
    t.is(error, AuthRepositoryErrors.InvalidCredentials)
  }
})
