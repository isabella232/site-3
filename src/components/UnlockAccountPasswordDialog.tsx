import * as React from 'react';
import { createRef } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Modal } from 'semantic-ui-react';
import { dismissUnlockDialog, unlockAccount } from '../actions/accounts-actions';
import { GlobalState } from '../reducers';
import { Account } from '../util/model';
import AnimatedTrackedModal from './AnimatedTrackedModal';
import { AnalyticsCategory } from './GoogleAnalytics';
import TrackedButton from './TrackedButton';

interface UnlockAccountPasswordDialogProps {
  unlockingAccount: Account | null;
  unlockAccount: (id: string, password: string) => void;
  dismissUnlockDialog: () => void;
}

interface UnlockAccountPasswordDialogState {
  password: string;
  rendering: Account | null;
}

export default connect(
  ({ accounts: { collectingUnlockPasswordId, accounts } }: GlobalState) => ({
    unlockingAccount: accounts.find(account => account.id === collectingUnlockPasswordId) || null
  }),
  {
    unlockAccount,
    dismissUnlockDialog
  }
)(
  class UnlockAccountPasswordDialog extends React.PureComponent<UnlockAccountPasswordDialogProps, UnlockAccountPasswordDialogState> {
    state = {
      password: '',
      rendering: null
    };

    private readonly submitButton = createRef<HTMLButtonElement>();

    componentDidMount(): void {
      if (this.props.unlockingAccount) {
        this.setState({ rendering: this.props.unlockingAccount });
      }
    }

    componentWillReceiveProps(nextProps: Readonly<UnlockAccountPasswordDialogProps>) {
      if (nextProps.unlockingAccount && nextProps.unlockingAccount !== this.props.unlockingAccount) {
        this.setState({ password: '', rendering: nextProps.unlockingAccount });
      }
    }

    render() {
      const {
        dismissUnlockDialog,
        unlockAccount,
        unlockingAccount
      } = this.props;

      const { password, rendering } = this.state;

      const showing = unlockingAccount ? unlockingAccount : rendering;

      return (
        <AnimatedTrackedModal open={!!unlockingAccount} size="mini" modalName="UNLOCK_ACCOUNT_PASSWORD_DIALOG">
          <Modal.Header>
            Unlock account
          </Modal.Header>
          <Modal.Content>
            <Form onSubmit={() => unlockingAccount && unlockAccount(unlockingAccount.id, password)}>
              <Form.Field>
                <label htmlFor="unlock-account-name">Account name</label>
                <Input
                  id="unlock-account-name"
                  type="text"
                  autoComplete="off"
                  fluid
                  readOnly
                  value={showing && showing.name}
                />
              </Form.Field>

              <Form.Field style={{ marginBottom: 0 }}>
                <label htmlFor="unlock-account-password">Account password</label>
                <Input
                  id="unlock-account-password"
                  type="password"
                  fluid
                  placeholder="Account password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </Form.Field>

              <button type="submit" style={{ visibility: 'hidden' }}
                      ref={this.submitButton}/>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <TrackedButton type="button" onClick={() => unlockingAccount && dismissUnlockDialog()}
                           category={AnalyticsCategory.ACCOUNTS} action={'CANCEL_UNLOCK'}>
              Cancel
            </TrackedButton>
            <TrackedButton
              primary type="button"
              onClick={() => this.submitButton.current && this.submitButton.current.click()}
              category={AnalyticsCategory.ACCOUNTS} action={'SUBMIT_PASSWORD_UNLOCK'}
            >
              <Icon name="key"/> Unlock
            </TrackedButton>
          </Modal.Actions>
        </AnimatedTrackedModal>
      );
    }
  }
);