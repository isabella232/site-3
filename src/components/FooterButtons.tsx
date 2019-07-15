import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { openSidebar } from '../actions/ui-actions';
import { AnalyticsCategory } from './GoogleAnalytics';
import LocationAwareLink from './LocationAwareLink';
import TrackedButton from './TrackedButton';

interface FooterButtonProps {
  openSidebar: typeof openSidebar
}

const StyledButtonGroup = styled(Button.Group)`
  &.is-ios-standalone {
    > .button {
      padding-bottom: 2rem;
    }
  }
`;

const isIosStandalone = window &&
  window.navigator &&
  'standalone' in window.navigator &&
  window.navigator[ 'standalone' ] === true;

const FooterButtons = ({ openSidebar }: FooterButtonProps) => {
  return (
    <StyledButtonGroup size="large" fluid className={isIosStandalone ? 'is-ios-standalone' : ''}>
      <TrackedButton
        style={{ borderRadius: 0 }}
        title="Return to the Ethvault home page"
        secondary
        id="home-button"
        category={AnalyticsCategory.UI}
        action="GO_HOME_BUTTON"
        as={LocationAwareLink}
        to={{ pathname: '/', hash: '' }}>
        <Icon name="home"/> Home
      </TrackedButton>
      <TrackedButton
        style={{ borderRadius: 0 }}
        title="Open the vault to manage your accounts"
        primary
        id="open-vault-button"
        category={AnalyticsCategory.UI}
        action="OPEN_VAULT_BUTTON"
        onClick={openSidebar}>
        <Icon name="ethereum"/> Vault
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