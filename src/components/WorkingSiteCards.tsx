import React from 'react';
import { Card } from 'semantic-ui-react';
import styled from 'styled-components';
import LocationAwareLink from './LocationAwareLink';
import { WORKING_SITES_INFO } from './WorkingSitesInfo';

const StyledContainer = styled.div`
  margin-top: 2rem;
`;

export default function WorkingSiteCards() {
  return (
    <StyledContainer>
      <Card.Group stackable itemsPerRow={2}>
        {
          WORKING_SITES_INFO.map(({ name, labels, description, url }) => (
            <Card key={url} fluid link as={LocationAwareLink} to={{ pathname: `/browse/${encodeURIComponent(url)}` }}>
              <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>
                  {labels.join(', ')}
                </Card.Meta>
                <Card.Description>
                  {description}
                </Card.Description>
              </Card.Content>
            </Card>
          ))
        }
      </Card.Group>
    </StyledContainer>
  );
}