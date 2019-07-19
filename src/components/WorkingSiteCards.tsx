import React from 'react';
import { Card, Header, Icon, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import searchSites from '../util/search-sites';
import { AnalyticsCategory } from './GoogleAnalytics';
import LocationAwareLink from './LocationAwareLink';
import SiteCard from './SiteCard';
import TrackedButton from './TrackedButton';

const StyledContainer = styled.div`
  margin-top: 2rem;
`;

interface WorkingSiteCardsProps {
  search: string;
}

export default function WorkingSiteCards({ search }: WorkingSiteCardsProps) {
  const matches = searchSites(search);

  return (
    <StyledContainer>
      <Card.Group stackable itemsPerRow={3} doubling>
        {
          matches.map(
            site => <SiteCard key={site.url.host} site={site} size="large"/>
          )
        }
      </Card.Group>
      {
        matches.length === 0 ?
          (
            <Segment placeholder>
              <Header icon>
                <Icon name="search minus"/>
                No DAPPs found
              </Header>
              <TrackedButton
                category={AnalyticsCategory.UI} action="CLEAR_SEARCH_PLACEHOLDER_BUTTON"
                as={LocationAwareLink} to={{ hash: '' }}><Icon name="close"/> Clear search</TrackedButton>
            </Segment>
          ) : null
      }
    </StyledContainer>
  );
}