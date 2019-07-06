export interface Account {
  id: string;
  address: string;
  version: number;
  name: string;
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
}