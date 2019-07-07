import * as React from 'react';
import { connect } from 'react-redux';
import { Dimmer, Header, Icon, Item, Loader, Message, Segment } from 'semantic-ui-react';
import { openCreateAccountDialog } from '../actions/ui-actions';
import { GlobalState } from '../reducers';
import { AccountsState } from '../reducers/accounts-reducer';
import AccountItem from './AccountItem';
import CreateAccountButton from './CreateAccountButton';
import SignOutButton from './SignOutButton';

interface AccountListProps {
  accountsState: AccountsState;
  openCreateAccountDialog: typeof openCreateAccountDialog;
}

const AccountList = connect(
  ({ accounts }: GlobalState) => ({ accountsState: accounts }),
  { openCreateAccountDialog }
)(
  ({
     accountsState: { accounts, isLoading, loadError }
   }: AccountListProps) => {
    const sortedAccounts = [ ...accounts ].sort((a1, a2) => {
      return (a2.created - a1.created);
    });

    return (
      <Dimmer.Dimmable>
        <Dimmer active={isLoading} inverted>
          <Loader/>
        </Dimmer>

        {
          loadError ?
            <Message error>
              <Message.Header>Failed to load accounts</Message.Header>
              <Message.Content>{loadError}</Message.Content>
            </Message> :
            null
        }

        <CreateAccountButton/>

        <SignOutButton floated="right"/>

        <Item.Group divided unstackable>
          {
            sortedAccounts.map(
              account => <AccountItem key={account.id} account={account}/>
            )
          }
        </Item.Group>

        {
          accounts.length === 0 ?
            (
              <Segment placeholder>
                <Header icon>
                  <Icon name="key"/> You have not created any accounts.
                </Header>
              </Segment>
            )
            : null
        }
      </Dimmer.Dimmable>
    );
  });

export default AccountList;