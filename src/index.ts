import { fetcher } from 'itty-fetcher'

import type { LoginResult, User } from './types'

export type { LoginResult, Role, User } from './types'

function camelCase(s: string): string {
  return s.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function camelCaseKeys<T>(value: T): T {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }

  return Object.fromEntries(Object.entries(value).map(([key, val]) => [camelCase(key), val])) as T
}

function parseDates<T>(value: T): T {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !('createdAt' in value)) {
    return value
  }

  return typeof value.createdAt === 'string'
    ? { ...value, createdAt: new Date(value.createdAt) }
    : value
}

export class AuthClient {
  private readonly client

  /**
   * Creates a new authenticator instance.
   *
   * @param url - The website URL
   */
  constructor(url: string) {
    this.client = fetcher({
      base: `${url}/api/auth`,
      after: [(data: object) => parseDates(camelCaseKeys(data))],
    })
  }

  /**
   * Authenticate a user using credentials and generate a unique access token.
   *
   * @param email - The user email address
   * @param password - The user password
   * @param code - The user 2FA code, only required after a pending 2FA response
   * @returns The user profile with the unique access token, a pending 2FA result
   */
  public async login(email: string, password: string, code?: string | null): Promise<LoginResult> {
    const payload = { email, password, ...(code ? { code } : {}) }

    try {
      const user = await this.client.post<unknown, User>('/authenticate', payload)

      return { status: 'success', ...user }
    } catch (error) {
      if (!error || typeof error !== 'object' || !('reason' in error)) {
        throw error
      }

      const response = error as LoginResult
      if (response.status === 'pending' && response.reason === '2fa') {
        return { ...response, requires2fa: true }
      }

      if (response.status === 'error') {
        return response
      }

      throw error
    }
  }

  /**
   * Verify a user access token and get the user profile on success.
   *
   * @param accessToken - The user unique access token
   * @returns The user profile
   */
  public verify(accessToken: string): Promise<User> {
    return this.client.post<unknown, User>('/verify', { access_token: accessToken })
  }

  /**
   * Logout a user and invalidate the given access token.
   *
   * @param accessToken - The user unique access token to invalidate
   */
  public async logout(accessToken: string): Promise<void> {
    return this.client.post('/logout', { access_token: accessToken })
  }
}
