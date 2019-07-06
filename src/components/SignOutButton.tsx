import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Button, ButtonProps, Icon } from 'semantic-ui-react';
import { loggedOut } from '../actions/auth-actions';
import { AUTH0_BASE_URL, AUTH0_CLIENT_ID } from '../util/env';

const BASE_LOGOUT_URL = `${AUTH0_BASE_URL}/v2/logout?client_id=${encodeURIComponent(AUTH0_CLIENT_ID)}&returnTo=`;

/**
 * This URL points the user to return to the app with its current path in the URL so we can redirect back to the path.
 */
function getSignOutUrl(pathname: string) {
  return `${BASE_LOGOUT_URL}${encodeURIComponent(`${window.location.origin}/logout#path=${encodeURIComponent(pathname)}`)}`;
}

const SignOutButton = connect(
  null,
  { loggedOut }
)(
  ({ loggedOut, ...props }: ButtonProps & { loggedOut: () => void }) => (
    <Route>
      {
        ({ location }) => (
          <Button
            compact
            secondary
            {...props}
            onClick={loggedOut}
            href={getSignOutUrl(location.pathname)}>
            <Icon name="log out"/> Sign Out
          </Button>
        )
      }
    </Route>
  )
);

export default SignOutButton;