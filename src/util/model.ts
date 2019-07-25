export interface Account {
  id: string;
  address: string;
  version: number;
  name: string;
  ensName: string | null;
  description: string;
  created: number;
  updated: number;
}

export interface AccountWithEncryptedJson extends Account {
  encryptedJson: any;
}

export interface Token {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  state: string;

  // The epoch milliseconds when the token is expected to expire. This is calculated on the client when the token
  // is received.
  expires_at: number;
}

/**
 * Return true if the token has expired.
 * @param token token to check
 */
export function isExpired(token: Token) {
  return token.expires_at < new Date().getTime();
}

/**
 * Return true if the object is the shape of a valid token.
 * @param value that may or may not be a token
 */
export function isValidToken(value: any): value is Token {
  return typeof value === 'object' &&
    typeof value.access_token === 'string' &&
    typeof value.state === 'string' &&
    typeof value.scope === 'string' &&
    typeof value.expires_in === 'number' &&
    typeof value.expires_at === 'number' &&
    value.token_type === 'Bearer';
}