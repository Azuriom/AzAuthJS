export interface Role {
  readonly id: number
  name: string
  color: string
}

export interface User {
  readonly id: number
  username: string
  uuid: string
  accessToken: string
  email?: string
  emailVerified: boolean
  money: number
  role: Role
  banned: boolean
  readonly createdAt: Date
}

export type LoginResult =
  | ({ status: 'success' } & User)
  | { status: 'pending'; reason: '2fa'; message: string; requires2fa: true }
  | { status: 'error'; reason: string; message: string }
