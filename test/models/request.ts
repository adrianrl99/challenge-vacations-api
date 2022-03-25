import test from 'ava'

import { newRequest, RequestPartialCreate } from '~/models'

test('newRequest -> it works', async t => {
  const partial_request: RequestPartialCreate = {
    author: '1',
    vacation_start_date: Date.now(),
    vacation_end_date: Date.now() + 1000 * 60 * 60 * 24 * 7, /// 7 days more
  }
  const request = newRequest(partial_request)
  t.is(request.status, 'pending')
})
