import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { openSidebar } from '../actions/ui-actions';
import LocationAwareLink from './LocationAwareLink';

interface FooterButtonProps {
  openSidebar: typeof openSidebar
}

const FooterButtons = ({ openSidebar }: FooterButtonProps) => {
  return (
    <Button.Group size="large" fluid>
      <Button
        style={{ borderRadius: 0 }}
        title="Return to the Ethvault home page"
        secondary
        id="home-button"
        as={LocationAwareLink}
        to={{ pathname: '/' }}>
        <Icon name="home"/> Home
      </Button>
      <Button
        style={{ borderRadius: 0 }}
        title="Open the vault to manage your accounts"
        primary
        id="open-vault-button"
        onClick={openSidebar}>
        <Icon name="ethereum"/> Vault
      </Button>
    </Button.Group>
  );
};

export default connect(
  null,
  { openSidebar }
)(
  FooterButtons
);