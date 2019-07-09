import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { ButtonProps, Icon } from 'semantic-ui-react';
import { loggedOut } from '../actions/auth-actions';
import { AUTH0_BASE_URL, AUTH0_CLIENT_ID } from '../util/env';
import { AnalyticsCategory } from './GoogleAnalytics';
import TrackedButton from './TrackedButton';

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
          <TrackedButton
            compact
            secondary
            category={AnalyticsCategory.UI}
            action="SIGN_OUT_BUTTON"
            {...props}
            onClick={loggedOut}
            href={getSignOutUrl(location.pathname)}>
            <Icon name="log out"/> Sign Out
          </TrackedButton>
        )
      }
    </Route>
  )
);

export default SignOutButton;