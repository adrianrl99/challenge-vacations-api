import test from 'ava'

import { toWorkerResult, Worker, WorkerResult } from '~/models'

test('toWorkerResult -> it works', async t => {
  const worker: Worker = {
    id: '1',
    name: 'John Doe',
    token: '123456789',
    password: '123456789',
    created_at: 1647957561003,
    updated_at: 1647957561003,
    remaining_vacations: 10,
  }
  const workerResult: WorkerResult = {
    id: '1',
    name: 'John Doe',
    created_at: 1647957561003,
    updated_at: 1647957561003,
    remaining_vacations: 10,
  }
  t.deepEqual(toWorkerResult(worker), workerResult)
})
