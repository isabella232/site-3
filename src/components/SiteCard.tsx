import React from 'react';
import { Card, CardProps, Image, Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { CATEGORY_LABEL_COLORS, Site } from '../util/sites-info';
import { AnalyticsCategory, track } from './GoogleAnalytics';
import LocationAwareLink from './LocationAwareLink';

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

export interface SiteCardProps extends CardProps {
  site: Site
}

export default function SiteCard({ site: { name, url, logo, category, description, labels }, ...cardProps }: SiteCardProps) {
  return (
    <Card
      {...cardProps}
      fluid link as={LocationAwareLink}
      to={{ pathname: '/browse', hash: url.host + (url.pathname === '/' ? '' : url.pathname) }}
      onClick={() => track(AnalyticsCategory.UI, 'CLICK_WORKING_SITE_CARD', name)}>
      <StyledImage src={logo} wrapped ui={false} alt={`${name} Logo`}/>
      <StyledCardContentNoGrow>
        <Card.Header>{name}</Card.Header>
      </StyledCardContentNoGrow>
      <StyledCardContentNoGrow>
        <Card.Meta>
          <Label size="large" key="category" color={CATEGORY_LABEL_COLORS[ category ]}>{category}</Label>
          {labels.map(({ text, color }, ix) => <Label key={ix} size="large" color={color}>{text}</Label>)}
        </Card.Meta>
      </StyledCardContentNoGrow>
      <Card.Content>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}