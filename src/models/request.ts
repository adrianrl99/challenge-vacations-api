import { v4 as uuid } from 'uuid'

export type RequestStatus = 'pending' | 'approved' | 'rejected'
export const ALLOWED_REQUEST_STATUS: RequestStatus[] = [
  'approved',
  'pending',
  'rejected',
]

export interface Request {
  id: string
  author: string
  status: RequestStatus
  resolved_by?: string
  created_at: number
  updated_at: number
  vacation_start_date: number
  vacation_end_date: number
}

export interface RequestPartialCreate {
  author: string
  vacation_start_date: number
  vacation_end_date: number
}

export interface RequestPartialStatus {
  id: string
  status: RequestStatus
  resolved_by: string
}

export type NewRequest = (req: RequestPartialCreate) => Request
export const newRequest: NewRequest = req => {
  const at = new Date().getTime()
  return {
    ...req,
    id: uuid(),
    status: 'pending',
    created_at: at,
    updated_at: at,
  }
}
