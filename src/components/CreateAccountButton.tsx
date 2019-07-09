import * as React from 'react';
import { connect } from 'react-redux';
import { ButtonProps, Icon } from 'semantic-ui-react';
import { openCreateAccountDialog } from '../actions/ui-actions';
import { AnalyticsCategory } from './GoogleAnalytics';
import TrackedButton from './TrackedButton';

const CreateAccountButton = connect(
  null,
  { onClick: openCreateAccountDialog }
)(
  (props: ButtonProps) => (
    <TrackedButton {...props} primary compact category={AnalyticsCategory.ACCOUNTS} action={'CREATE_ACCOUNT_CLICKED'}>
      <Icon name="plus"/> Create account
    </TrackedButton>
  )
);

export default CreateAccountButton;