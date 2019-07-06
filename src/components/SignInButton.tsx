import * as React from 'react';
import { Route } from 'react-router';
import { Button, ButtonProps, Icon } from 'semantic-ui-react';
import { AUTH0_API_AUDIENCE, AUTH0_BASE_URL, AUTH0_CLIENT_ID } from '../util/env';

function encodeParameters(parameters: { [ paramName: string ]: string }) {
  return Object.keys(parameters)
    .map(paramName => {
      const value = parameters[ paramName ];
      return `${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

export const AUTH_FLOW_STATE_LOCAL_STORAGE_KEY =
  'AUTH_FLOW_STATE_LOCAL_STORAGE_KEY';

export default function SignInButton(props: ButtonProps) {
  return (
    <Route>
      {routeProps => {
        const state = `${new Date().getTime()}:${window.location.pathname}`;

        const redirect_uri = `${window.location.origin}/authenticate`;

        const parameters = encodeParameters({
          redirect_uri: redirect_uri,
          response_type: 'token',
          client_id: AUTH0_CLIENT_ID,
          audience: AUTH0_API_AUDIENCE,
          state: state,
          scope: [
            'create_account',
            'read_accounts',
            'read_encrypted_account_data',
            'delete_account'
          ].join(' ')
        });

        return (
          <Button
            {...props}
            onClick={() => {
              sessionStorage.setItem(AUTH_FLOW_STATE_LOCAL_STORAGE_KEY, state);
            }}
            href={`${AUTH0_BASE_URL}/authorize?${parameters}`}
            title="Sign in to EthVault to manage your accounts and use Dapps"
            primary
          >
            <Icon name="sign in alternate"/> Sign In
          </Button>
        );
      }}
    </Route>
  );
}
