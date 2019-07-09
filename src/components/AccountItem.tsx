import * as React from 'react';
import { connect } from 'react-redux';
import { Divider, Dropdown, Icon, Item, Progress } from 'semantic-ui-react';
import styled from 'styled-components';
import { deleteAccount, exportKey, lockAccounts, openUnlock } from '../actions/accounts-actions';
import { GlobalState } from '../reducers';
import { getBlockyDataUri } from '../util/blockies';
import { Account } from '../util/model';
import AccountAddress from './AccountAddress';
import { AnalyticsCategory, track } from './GoogleAnalytics';

interface AccountItemOwnProps {
  account: Account;
}

interface AccountItemStateProps {
  isUnlocked: boolean;
  unlockProgress: number;
  isBeingDeleted: boolean;
  isExporting: boolean;
  isBeingUnlocked: boolean;
  disableActions: boolean;
}

interface AccountItemDispatchProps {
  openUnlock: (id: string) => void;
  lockAccounts: () => void;
  exportKey: (id: string) => void;
  deleteAccount: (id: string) => void;
}

interface AccountItemAllProps
  extends AccountItemOwnProps,
    AccountItemStateProps,
    AccountItemDispatchProps {
}

const JustifyContentRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;


export default connect<AccountItemStateProps,
  AccountItemDispatchProps,
  AccountItemOwnProps,
  GlobalState>(
  (
    {
      accounts: { unlockedAccount, exportingAccountId, deletingAccountId },
    }: GlobalState,
    ownProps: AccountItemOwnProps
  ) => ({
    isUnlocked:
      unlockedAccount.info !== null &&
      unlockedAccount.info.id === ownProps.account.id,
    isBeingUnlocked:
      unlockedAccount.progress.loading &&
      unlockedAccount.progress.id === ownProps.account.id,
    unlockProgress:
      unlockedAccount.progress.loading &&
      unlockedAccount.progress.id === ownProps.account.id
        ? unlockedAccount.progress.walletDecryptProgress
        : 0,
    isBeingDeleted: deletingAccountId === ownProps.account.id,
    isExporting: exportingAccountId === ownProps.account.id,

    disableActions:
      unlockedAccount.progress.loading || deletingAccountId !== null,
  }),
  {
    openUnlock,
    lockAccounts,
    exportKey,
    deleteAccount,
  }
)(({
     account: { id, name, description, created },
     isUnlocked,
     isBeingUnlocked,
     isExporting,
     unlockProgress,
     isBeingDeleted,
     disableActions,
     openUnlock,
     lockAccounts,
     exportKey,
     deleteAccount
   }: AccountItemAllProps) => {
  return (
    <Item key={id}>
      <Item.Image
        bordered
        title={`Account ID: ${id}`}
        src={getBlockyDataUri(id)}
        size="tiny"
      />

      <Item.Content>
        <Item.Header title={`Created ${new Date(created).toLocaleDateString()}`}>
          {name}
        </Item.Header>
        <Item.Meta>
          <AccountAddress accountId={id}/>
        </Item.Meta>
        <Item.Description title={description}>{description}</Item.Description>
        <Divider/>
        <Item.Extra>
          {
            isBeingUnlocked ?
              (
                <Progress indicating progress="percent" percent={Math.round(unlockProgress * 100)}/>
              ) :
              <JustifyContentRight>
                <Dropdown
                  text={isUnlocked ? 'Unlocked' : 'Locked'}
                  icon="lock"
                  labeled
                  className={`icon ${isUnlocked ? 'green' : ''}`}
                  button
                  loading={isExporting || isBeingDeleted}
                  compact>
                  <Dropdown.Menu direction="left">
                    <Dropdown.Header content="Account actions"/>
                    {
                      isUnlocked ?
                        <Dropdown.Item
                          onClick={() => {
                            track(AnalyticsCategory.ACCOUNTS, 'LOCK_ACCOUNTS_CLICKED');
                            lockAccounts();
                          }}
                          disabled={disableActions}>
                          <Icon name="lock open"/> Lock accounts
                        </Dropdown.Item> :
                        <Dropdown.Item
                          disabled={isBeingUnlocked || disableActions}
                          onClick={() => {
                            track(AnalyticsCategory.ACCOUNTS, 'UNLOCK_ACCOUNT_CLICKED');
                            openUnlock(id);
                          }}>
                          <Icon name="lock"/> Unlock account
                        </Dropdown.Item>
                    }
                    <Dropdown.Item
                      onClick={() => {
                        track(AnalyticsCategory.ACCOUNTS, 'EXPORT_KEY_CLICKED');
                        exportKey(id);
                      }}
                      disabled={isExporting || disableActions}>
                      <Icon name="download"/> Download encrypted backup
                    </Dropdown.Item>
                    <Dropdown.Item
                      disabled={disableActions}
                      onClick={() => {
                        track(AnalyticsCategory.ACCOUNTS, 'EDIT_ACCOUNT_CLICKED');
                        alert('Coming soon.');
                      }}>
                      <Icon name="pencil"/> Edit account
                    </Dropdown.Item>
                    <Dropdown.Item
                      disabled={isBeingDeleted || disableActions}
                      onClick={() => {
                        track(AnalyticsCategory.ACCOUNTS, 'DELETE_ACCOUNT_CLICKED');
                        if (
                          window.confirm(
                            `Are you sure you would like to delete account "${name}"?`
                          ) &&
                          window.confirm(
                            `Are you really really sure you would like to delete account "${name}"?`
                          )
                        ) {
                          deleteAccount(id);
                        }
                      }}>
                      <Icon name="trash"/> Delete account
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </JustifyContentRight>
          }
        </Item.Extra>
      </Item.Content>
    </Item>
  );
});
