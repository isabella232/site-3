import React from 'react';
import { Container, Icon, Message } from 'semantic-ui-react';
import LocationAwareLink from './LocationAwareLink';

export default function InvalidURLPage() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Message icon size="large">
        <Icon name="warning"/>
        <Message.Content>
          <Message.Header>Invalid URL</Message.Header>
          <div>
            It looks like the URL entered is not valid.
          </div>

          <div>
            <LocationAwareLink to={{ pathname: '/' }}>Home</LocationAwareLink>
          </div>
        </Message.Content>
      </Message>
    </Container>
  );
}