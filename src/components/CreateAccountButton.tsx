import * as React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonProps, Icon } from 'semantic-ui-react';
import { openCreateAccountDialog } from '../actions/ui-actions';

const CreateAccountButton = connect(
  null,
  { onClick: openCreateAccountDialog }
)(
  (props: ButtonProps) => (
    <Button {...props} primary compact>
      <Icon name="plus"/> Create account
    </Button>
  )
);

export default CreateAccountButton;