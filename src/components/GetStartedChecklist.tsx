import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, List, SemanticICONS } from 'semantic-ui-react';
import { GlobalState } from '../reducers';

function CheckboxItemIcon({ completed, incompleteIcon = 'x' }: { completed: boolean; incompleteIcon?: SemanticICONS; }) {
  return (
    <Icon name={completed ? 'check' : incompleteIcon} color={completed ? 'green' : 'black'}/>
  );
}

export const GetStartedChecklist = connect(
  ({ auth: { isLoggedIn }, accounts: { accounts, unlockedAccount: { info } } }: GlobalState) => ({
    isLoggedIn,
    hasAccounts: accounts.length > 0,
    isUnlocked: info !== null
  })
)(
  function ({ isLoggedIn, hasAccounts, isUnlocked }: { isLoggedIn: boolean; hasAccounts: boolean; isUnlocked: boolean; }) {
    return (
      <List size="large">
        <List.Item>
          <CheckboxItemIcon completed={isLoggedIn} incompleteIcon="sign-in"/>
          <List.Content>
            <List.Header>Sign in to Ethvault</List.Header>
            <List.Description>
              The first step is to sign in to Ethvault. Click the button down below to open your vault and sign in.
            </List.Description>
          </List.Content>
        </List.Item>

        <List.Item>
          <CheckboxItemIcon completed={hasAccounts} incompleteIcon="key"/>
          <List.Content>
            <List.Header>Create an account</List.Header>
            <List.Description>
              Once you're signed in, you need to create an account. You can do that from your vault. Make sure to choose
              a strong password to keep your account safe!
            </List.Description>
          </List.Content>
        </List.Item>

        <List.Item>
          <CheckboxItemIcon completed={isLoggedIn && hasAccounts} incompleteIcon="box"/>
          <List.Content>
            <List.Header>Back up your keys</List.Header>
            <List.Description>
              Download the keys for your newly created account and back them up somewhere safe.
              We recommend Google Drive or Dropbox.
              Write down your password in case you forget.
            </List.Description>
          </List.Content>
        </List.Item>

        <List.Item>
          <CheckboxItemIcon completed={isUnlocked} incompleteIcon="unlock"/>
          <List.Content>
            <List.Header>Unlock your account</List.Header>
            <List.Description>
              Unlock your account to make it available in the DAPPs. You can do this from your vault.
            </List.Description>
          </List.Content>
        </List.Item>

        <List.Item>
          <CheckboxItemIcon completed={isUnlocked && isLoggedIn && hasAccounts} incompleteIcon="app store"/>
          <List.Content>
            <List.Header>Use the DAPPs</List.Header>
            <List.Description>
              Try one of the DAPPs from the <Link to="/">home page</Link>.
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
    );
  }
);