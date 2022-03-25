import { UserToken } from './models/auth'

declare global {
  namespace Express {
    export interface Request {
      user: UserToken
    }
  }
}
