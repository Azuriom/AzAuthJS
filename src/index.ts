import type { AxiosInstance } from 'axios'
import type { User } from './models'

import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

function parseDates(data: unknown & { createdAt: unknown }) {
  if (typeof data.createdAt === 'string') {
    return { ...data, createdAt: new Date(data.createdAt) }
  }
  return data
}

export { Role, User } from './models'

export type LoginResult =
  | ({ status: 'success' } & User)
  | { status: 'pending'; reason: string; message: string; requires2fa: boolean }
  | { status: 'error'; reason: string; message: string }

export class AuthClient {
  private client: AxiosInstance

  /**
   * Creates a new authenticator instance.
   *
   * @param url - The website URL
   */
  constructor(url: string) {
    this.client = axios.create({
      baseURL: `${url}/api/auth`,
    })

    this.client.interceptors.response.use((response) => {
      return {
        ...response,
        data: parseDates(camelcaseKeys(response.data)),
      }
    })
  }

  /**
   * Authenticate a user using his credentials and generate a unique access token.
   *
   * @param email - The user email address
   * @param password - The user password
   * @param code - The user 2FA code
   * @returns The user profile with the unique access token
   */
  public async login(email: string, password: string, code: string = null): Promise<LoginResult> {
    return this.client
      .post('/authenticate', { email, password, code })
      .then((response) => ({ status: 'success', ...response.data }))
      .catch((error) => {
        // Inject the 'requires2fa' property in the result
        if (axios.isAxiosError<LoginResult>(error) && error.response) {
          const result = error.response.data

          if (result.status === 'pending' && result.reason === '2fa') {
            return { ...result, requires2fa: true }
          }
        }

        throw error
      })
  }

  /**
   * Verify a user access token and get the user profile on success.
   *
   * @param accessToken - The user unique access token
   * @returns The user profile
   */
  public verify(accessToken: string): Promise<User> {
    return this.client
      .post('/verify', { access_token: accessToken })
      .then((response) => response.data)
  }

  /**
   * Logout a user and invalidate the given access token.
   *
   * @param accessToken - The user unique access token to invalidate
   */
  public logout(accessToken: string): Promise<void> {
    return this.client
      .post('/logout', { access_token: accessToken })
      .then((response) => response.data)
  }
}
