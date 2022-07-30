export interface Role {
  readonly id: number
  name: string
  color: string
}

export interface User {
  username: string
  uuid: string
  accessToken: string
  readonly id: number
  email: string
  emailVerified: boolean
  money: number
  role: Role
  banned: boolean
  readonly createdAt: Date
}
