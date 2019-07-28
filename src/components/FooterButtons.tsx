import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Responsive, ResponsiveProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { openSidebar } from '../actions/ui-actions';
import { AnalyticsCategory } from './GoogleAnalytics';
import LocationAwareLink from './LocationAwareLink';
import TrackedButton from './TrackedButton';

interface FooterButtonProps {
  openSidebar: () => void;
}

const SMALL_SCREEN_WIDTH_PX = 768;

function OnWideScreens(props: ResponsiveProps) {
  return (
    <Responsive as={React.Fragment} {...props} minWidth={SMALL_SCREEN_WIDTH_PX}/>
  );
}

const StyledIcon = styled(Icon)`
  @media (max-width: ${SMALL_SCREEN_WIDTH_PX - 1}px) {
    margin: 0 !important;
  }
`;

const isIOSStandalone = (
  window &&
  window.navigator &&
  'standalone' in window.navigator &&
  (window.navigator as any).standalone === true
);

const StyledButtonGroup = styled(Button.Group)`
  > .button {
    border-radius: 0 !important;
    font-family: 'Exo 2', sans-serif;
    text-transform: uppercase;
    touch-action: none;
    ${isIOSStandalone ? 'padding-bottom: 2rem;' : ''}
  }
`;

const FooterButtons = ({ openSidebar }: FooterButtonProps) => {
  return (
    <StyledButtonGroup size="huge" fluid>
      <TrackedButton
        title="Return to the Ethvault home page"
        secondary
        id="home-button"
        category={AnalyticsCategory.UI}
        action="GO_HOME_BUTTON"
        as={LocationAwareLink}
        to={{ pathname: '/', hash: '' }}>
        <StyledIcon name="home"/><OnWideScreens> Home</OnWideScreens>
      </TrackedButton>
      <TrackedButton
        title="Open the vault to manage your accounts"
        primary
        id="open-vault-button"
        category={AnalyticsCategory.UI}
        action="OPEN_VAULT_BUTTON"
        onClick={openSidebar}>
        <StyledIcon name="ethereum"/><OnWideScreens> Vault</OnWideScreens>
      </TrackedButton>
      <TrackedButton
        category={AnalyticsCategory.UI}
        action={'ABOUT_BUTTON_CLICKED'}
        as={LocationAwareLink}
        title="Learn more about Ethvault"
        to={{ pathname: '/about' }}>
        <StyledIcon name="help circle"/><OnWideScreens> About</OnWideScreens>
      </TrackedButton>
    </StyledButtonGroup>
  );
};

export default connect(
  null,
  { openSidebar }
)(
  FooterButtons
);