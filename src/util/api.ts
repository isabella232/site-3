import { BASE_API_URL } from './env';
import { Account, AccountWithEncryptedJson, Token } from './model';

export class UnauthenticatedError extends Error {
}

export class UnauthorizedError extends Error {
}

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
    return apiFetch('/accounts', { token });
  }

  public static async deleteAccount(id: string, token: Token): Promise<void> {
    return apiFetch(`/accounts/${id}`, { method: 'DELETE', token });
  }

  public static createAccount(request: CreateAccountRequest, token: Token): Promise<Account> {
    return apiFetch('/accounts', { token, method: 'POST', body: JSON.stringify(request) });
  }

  public static getAccountWithEncryptedJson(id: string, token: Token): Promise<AccountWithEncryptedJson> {
    return apiFetch(`/accounts/${id}`, { token });
  }
}
