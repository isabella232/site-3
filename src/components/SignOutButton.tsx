import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { ButtonProps, Icon } from 'semantic-ui-react';
import { loggedOut } from '../actions/auth-actions';
import { AUTH0_BASE_URL, AUTH0_CLIENT_ID } from '../util/env';
import { AnalyticsCategory } from './GoogleAnalytics';
import TrackedButton from './TrackedButton';

const BASE_LOGOUT_URL = `${AUTH0_BASE_URL}/v2/logout?client_id=${encodeURIComponent(AUTH0_CLIENT_ID)}&returnTo=`;

const SignOutButton = connect(
  null,
  { loggedOut }
)(
  ({ loggedOut, ...props }: ButtonProps & { loggedOut: () => void }) => (
    <Route>
      {
        ({ location }) => {
          const returnUrl = `${window.location.origin}/logout#${encodeURIComponent(window.location.href.substring(window.location.origin.length))}`;

          const signoutUrl = `${BASE_LOGOUT_URL}${encodeURIComponent(returnUrl)}`;

          return (
            <TrackedButton
              compact
              secondary
              category={AnalyticsCategory.UI}
              action="SIGN_OUT_BUTTON"
              {...props}
              onClick={loggedOut}
              href={signoutUrl}>
              <Icon name="log out"/> Sign Out
            </TrackedButton>
          );
        }
      }
    </Route>
  )
);

export default SignOutButton;