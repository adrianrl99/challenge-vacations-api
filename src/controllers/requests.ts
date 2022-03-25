import { RequestHandler } from 'express'

import { RequestStatus } from '~/models'
import { repos } from '~/repository'

const repo = repos.requests

export const getRequests: RequestHandler = async (req, res) => {
  try {
    const requests = await repo.getRequests({
      status: req.query.status as RequestStatus,
      month: Number(req.query.month),
      range: {
        start_date: req.query.start_date as string | number,
        end_date: req.query.end_date as string | number,
      },
    })
    res.status(200).json({ data: requests })
  } catch {
    return res.status(500).end()
  }
}
