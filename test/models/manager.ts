import test from 'ava'

import { Manager, ManagerResult, toManagerResult } from '~/models'

test('toManagerResult -> it works', async t => {
  const manager: Manager = {
    id: '1',
    name: 'John Doe',
    token: '123456789',
    password: '123456789',
    created_at: 1647957561003,
    updated_at: 1647957561003,
  }
  const managerResult: ManagerResult = {
    id: '1',
    name: 'John Doe',
    created_at: 1647957561003,
    updated_at: 1647957561003,
  }
  t.deepEqual(toManagerResult(manager), managerResult)
})
