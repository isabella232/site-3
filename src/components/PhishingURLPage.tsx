import React from 'react';
import { Container, Icon, Message } from 'semantic-ui-react';
import LocationAwareLink from './LocationAwareLink';

export default function PhishingURLPage() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Message icon size="large" warning>
        <Icon name="warning sign"/>
        <Message.Content>
          <Message.Header>Phishing URL</Message.Header>
          <div>
            The URL entered is a known phishing URL. Ethvault has blocked the page.
          </div>

          <div>
            <LocationAwareLink to={{ pathname: '/' }}>Home</LocationAwareLink>
          </div>
        </Message.Content>
      </Message>
    </Container>
  );
}