export interface SignInData {
  name: string
  password: string
  type: 'worker' | 'manager'
}

export interface UserToken {
  id: string
  type: 'worker' | 'manager'
}
