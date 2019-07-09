import React from 'react';
import { Card, Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { AnalyticsCategory, track } from './GoogleAnalytics';
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
            <Card
              key={url} fluid link as={LocationAwareLink} to={{ pathname: `/browse/${encodeURIComponent(url)}` }}
              onClick={() => track(AnalyticsCategory.UI, 'CLICK_WORKING_SITE_CARD', name)}>
              <Card.Content>
                <Card.Header>{name}</Card.Header>
              </Card.Content>
              <Card.Content>
                <Card.Meta>
                  {labels.map(({ text, color }, ix) => <Label size="small" key={ix} color={color}>{text}</Label>)}
                </Card.Meta>
              </Card.Content>
              <Card.Content>
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