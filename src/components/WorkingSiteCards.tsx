import React from 'react';
import { Button, Card, Header, Icon, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import searchSites from '../util/search-sites';
import SiteCard from './SiteCard';
import LocationAwareLink from './LocationAwareLink';

const StyledContainer = styled.div`
  margin-top: 2rem;
`;

interface WorkingSiteCardsProps {
  search: string;
}

export default function WorkingSiteCards({ search }: WorkingSiteCardsProps) {
  const matches = searchSites(search).flatMap(({ results }) => results);

  return (
    <StyledContainer>
      <Card.Group stackable itemsPerRow={4} doubling>
        {
          matches.map(
            site => <SiteCard key={site.url} site={site}/>
          )
        }
      </Card.Group>
      {
        matches.length === 0 ?
          (
            <Segment placeholder>
              <Header icon>
                <Icon name="app store"/>
                No apps found
              </Header>
              <Button primary as={LocationAwareLink} to={{ hash: '' }}>Clear search</Button>
            </Segment>
          ) : null
      }
    </StyledContainer>
  );
}