import * as React from 'react';
import { Divider, Header, Icon, Segment } from 'semantic-ui-react';
import SignInButton from './SignInButton';

export function LoggedOutPlaceholder() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="key"/> You must be signed in to use your vault.
      </Header>
      <SignInButton size="large"/>
    </Segment>
  );
}
