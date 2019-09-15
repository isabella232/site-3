import { BASE_API_URL } from './env';
import { Account, Token } from './model';

/**
 * Error that is thrown when the token is invalid or expired.
 */
export class UnauthenticatedError extends Error {
}

/**
 * Error that is thrown when the token does not have sufficient scopes.
 */
export class UnauthorizedError extends Error {
}

/**
 * Fetch content from the API.
 * @param path path to hit
 * @param token token to use
 * @param init typical fetch parameters
 */
const apiFetch = (path: string, { token, ...init }: Omit<RequestInit, 'url'> & { token: Token }): Promise<any> =>
  fetch(`${BASE_API_URL}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      'Authorization': `${token.token_type} ${token.access_token}`,
      'Content-Type': 'application/json'
    },
  })
    .then(
      async response => {
        if (response.status === 401) {
          throw new UnauthenticatedError();
        }

        if (response.status === 403) {
          throw new UnauthorizedError();
        }

        if (!response.ok) {
          try {
            const result = await response.text();
            console.error('Error from API: ', result);
          } catch (error) {
            console.error('Could not read error response from API', error);
          }

          throw new Error(`Failed to get the accounts from the API: status code ${response.status}`);
        }

        if (response.status === 204) {
          return;
        }

        return response.json();
      }
    );


export interface CreateAccountRequest {
  name: string;
  description: string;
  encryptedJson: any;
  ensName?: string;
}

export default class API {
  public static async getAccounts(token: Token): Promise<Account[]> {
    return apiFetch('/v1/accounts', { token });
  }

  public static async deleteAccount(id: string, token: Token): Promise<void> {
    return apiFetch(`/v1/accounts/${id}`, { method: 'DELETE', token });
  }

  public static createAccount(request: CreateAccountRequest, token: Token): Promise<Account> {
    return apiFetch('/v1/accounts', { token, method: 'POST', body: JSON.stringify(request) });
  }

  public static getEncryptedJson(id: string, token: Token): Promise<any> {
    return apiFetch(`/v1/accounts/${id}/encrypted-json`, { token });
  }
}
