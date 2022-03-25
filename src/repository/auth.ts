import jwt from 'jsonwebtoken'

import config from '~/config'
import { Manager, Worker } from '~/models'
import { SignInData, UserToken } from '~/models/auth'

import { ManagersRepository } from './managers'
import { WorkersRepository } from './workers'

export type AuthRepository = {
  signin: (data: SignInData) => Promise<string>
}

export enum AuthRepositoryErrors {
  UnknownUserType = 'Unknown user type',
  InvalidCredentials = 'Invalid credentials',
}

export type AuthRepositoryOptions = {
  repos: {
    managers: ManagersRepository
    workers: WorkersRepository
  }
}

export const mockAuthRepository = ({
  repos,
}: AuthRepositoryOptions): AuthRepository => ({
  signin: async (data: SignInData) => {
    let user: Manager | Worker | null
    let repo: ManagersRepository | WorkersRepository

    if (data.type === 'manager') {
      user = await repos.managers.getManagerByName(data.name)
      repo = repos.managers
    } else if (data.type === 'worker') {
      user = await repos.workers.getWorkerByName(data.name)
      repo = repos.workers
    } else {
      throw AuthRepositoryErrors.UnknownUserType
    }

    if (user.password !== data.password) {
      throw AuthRepositoryErrors.InvalidCredentials
    }

    const userToken: UserToken = {
      id: user.id,
      type: data.type,
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: userToken,
      },
      config.SECRET_KEY,
      {
        algorithm: 'HS256',
      },
    )

    repo.updateToken({ id: user.id, token })

    return token
  },
})
