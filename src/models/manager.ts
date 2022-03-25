export interface Manager {
  id: string
  name: string
  token?: string
  password: string
  created_at: number
  updated_at: number
}

export type ManagerResult = Omit<Manager, 'password'>
export type ManagerPartialToken = {
  id: string
  token: string
}

export type ToManagerResult = (manager: Manager) => ManagerResult
export const toManagerResult: ToManagerResult = manager => ({
  id: manager.id,
  name: manager.name,
  created_at: manager.created_at,
  updated_at: manager.updated_at,
})
