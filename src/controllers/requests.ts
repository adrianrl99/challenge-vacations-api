import { RequestHandler } from 'express'

import { RequestStatus } from '~/models'
import { repos } from '~/repository'

const repo = repos.requests

export const getRequests: RequestHandler = async (req, res) => {
  try {
    const requests = await repo.getRequests({
      status: req.query.status as RequestStatus,
    })
    res.status(200).json({ data: requests })
  } catch {
    return res.status(500).end()
  }
}
