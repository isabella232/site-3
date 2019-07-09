import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { openSidebar } from '../actions/ui-actions';
import { AnalyticsCategory } from './GoogleAnalytics';
import LocationAwareLink from './LocationAwareLink';
import TrackedButton from './TrackedButton';

interface FooterButtonProps {
  openSidebar: typeof openSidebar
}

const FooterButtons = ({ openSidebar }: FooterButtonProps) => {
  return (
    <Button.Group size="large" fluid>
      <TrackedButton
        style={{ borderRadius: 0 }}
        title="Return to the Ethvault home page"
        secondary
        id="home-button"
        category={AnalyticsCategory.UI}
        action="GO_HOME_BUTTON"
        as={LocationAwareLink}
        to={{ pathname: '/' }}>
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
    </Button.Group>
  );
};

export default connect(
  null,
  { openSidebar }
)(
  FooterButtons
);