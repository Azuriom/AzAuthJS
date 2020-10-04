import axios, { AxiosInstance } from 'axios';
import { User } from './User';
import camelcaseKeys = require('camelcase-keys');

export class Authenticator {
  private client: AxiosInstance;

  /**
   * Creates a new authenticator instance.
   *
   * @param url - The website URL
   */
  constructor(url: string) {
    this.client = axios.create({
      baseURL: `${url}/api/auth`,
    });

    this.client.interceptors.response.use((response) => {
      return {
        ...response,
        data: Authenticator.parseDates(camelcaseKeys(response.data)),
      };
    });
  }

  /**
   * Authenticate an user using his credentials and generate an unique access token.
   *
   * @param email - The user email address
   * @param password - The user password
   * @returns The user profile with the unique access token
   */
  public async auth(email: string, password: string): Promise<User> {
    return this.client
      .post('/authenticate', {
        email,
        password,
      })
      .then((response) => response.data);
  }

  /**
   * Verify an user access token and get the user profile on success.
   *
   * @param accessToken - The user unique access token
   * @returns The user profile
   */
  public async verify(accessToken: string): Promise<User> {
    return this.client
      .post('/verify', {
        access_token: accessToken,
      })
      .then((response) => response.data);
  }

  /**
   * Logout an user and invalidate the given access token.
   *
   * @param accessToken - The user unique access token to invalidate
   */
  public async logout(accessToken: string): Promise<void> {
    return this.client
      .post('/logout', {
        access_token: accessToken,
      })
      .then((response) => response.data);
  }

  private static parseDates(data) {
    if ('createdAt' in data) {
      data.createdAt = new Date(data.createdAt);
    }
    return data;
  }
}
