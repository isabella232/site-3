import * as React from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import SignInButton from './SignInButton';

export function LoggedOutPlaceholder() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="key"/> You must be signed in to use the vault.
      </Header>
      <SignInButton/>
    </Segment>
  );
}
