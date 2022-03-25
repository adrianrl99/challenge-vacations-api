import test from 'ava'

import { diffDates } from '~/utils/helpers'

test('diffDates', async t => {
  const a = new Date(Date.now()).getTime()
  const b = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).getTime() // 7 days more
  const diff = diffDates(a, b)
  t.is(diff, 7)
})
