import React from 'react';
import { Card, Image, Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { AnalyticsCategory, track } from './GoogleAnalytics';
import LocationAwareLink from './LocationAwareLink';
import { WORKING_SITES_INFO } from './WorkingSitesInfo';

const StyledContainer = styled.div`
  margin-top: 2rem;
`;

const StyledImage = styled(Image)`
  img {
    height: 100% !important;
    width: auto !important;
  }
  
  display: flex !important;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.5);
  
  height: 12rem;
  padding: 1rem !important;
`;

const StyledCardContentNoGrow = styled(Card.Content)`
  flex-grow: 0 !important;
`;

export default function WorkingSiteCards() {
  return (
    <StyledContainer>
      <Card.Group stackable itemsPerRow={4} doubling>
        {
          WORKING_SITES_INFO.map(({ name, labels, description, url, logo }) => (
            <Card
              key={url} fluid link as={LocationAwareLink} to={{ pathname: `/browse/${encodeURIComponent(url)}` }}
              onClick={() => track(AnalyticsCategory.UI, 'CLICK_WORKING_SITE_CARD', name)}>
              <StyledImage src={logo} wrapped ui={false}/>
              <StyledCardContentNoGrow>
                <Card.Header>{name}</Card.Header>
              </StyledCardContentNoGrow>
              <StyledCardContentNoGrow>
                <Card.Meta>
                  {labels.map(({ text, color }, ix) => <Label size="small" key={ix} color={color}>{text}</Label>)}
                </Card.Meta>
              </StyledCardContentNoGrow>
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