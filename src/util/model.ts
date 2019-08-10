import jointz, { ExtractResultType } from 'jointz';

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

export const TokenValidator = jointz.object({
  access_token: jointz.string(),
  state: jointz.string(),
  scope: jointz.string(),
  expires_in: jointz.number(),
  expires_at: jointz.number(),
  token_type: jointz.constant('Bearer')
}).requiredKeys('access_token', 'state', 'scope', 'expires_in', 'expires_at', 'token_type');

export type Token = ExtractResultType<typeof TokenValidator>;

/**
 * Return true if the token has expired.
 * @param token token to check
 */
export function isExpired(token: Token) {
  return token.expires_at < new Date().getTime();
}
