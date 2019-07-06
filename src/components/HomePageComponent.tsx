import * as React from 'react';
import { Container } from 'semantic-ui-react';
import UrlSearchInput from './UrlSearchInput';
import WorkingSiteCards from './WorkingSiteCards';

export default function HomePageComponent() {
  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <UrlSearchInput/>

      <WorkingSiteCards/>
    </Container>
  );
}
