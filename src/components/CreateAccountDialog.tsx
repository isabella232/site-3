import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Form, Icon, Input, Modal, Progress, TextArea, TransitionablePortal } from 'semantic-ui-react';
import { createAccount, CreateAccountActionParams } from '../actions/accounts-actions';
import { closeCreateAccountDialog } from '../actions/ui-actions';
import { GlobalState } from '../reducers';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface CreateAccountDialogProps {
  open: boolean;
  createAccount: (action: CreateAccountActionParams) => void;
  closeCreateAccountDialog: () => void;
  error: string | null;
  loading: boolean;
  walletEncryptProgress: number;
}

interface FormState {
  name: string;
  description: string;
  password: string;
  confirmPassword: string;
}

interface CreateAccountDialogState {
  form: FormState;
}

export const CreateAccountDialog = connect(
  ({
     ui: { createAccountOpen },
     accounts: {
       createAccount: { error, loading, walletEncryptProgress }
     }
   }: GlobalState) => ({
    open: createAccountOpen,
    error,
    loading,
    walletEncryptProgress
  }),
  { createAccount, closeCreateAccountDialog }
)(
  class extends React.Component<CreateAccountDialogProps,
    CreateAccountDialogState> {
    state = {
      form: {
        name: '',
        description: '',
        password: '',
        confirmPassword: ''
      }
    };

    submitButtonRef: HTMLButtonElement | null = null;

    changed = (updates: Partial<FormState>) =>
      this.setState({ form: { ...this.state.form, ...updates } });

    clearForm = () =>
      this.setState({
        form: {
          name: '',
          description: '',
          password: '',
          confirmPassword: ''
        }
      });

    componentWillReceiveProps(
      nextProps: Readonly<CreateAccountDialogProps>
    ): void {
      if (nextProps.open && !this.props.open) {
        this.clearForm();
      }
    }

    render() {
      const props = this.props;
      const { form } = this.state;

      return (
        <TransitionablePortal transition={{ animation: 'scale' }} open={props.open}>
          <Modal open={true} size="mini">
            <Modal.Header>Create new account</Modal.Header>
            <Dimmer.Dimmable as={Modal.Content}>
              <Dimmer active={props.loading} inverted>
                <div style={{ minWidth: 200 }}>
                  <Progress
                    percent={Math.round(props.walletEncryptProgress * 100)}
                    progress="percent"
                    indicating>
                    {props.walletEncryptProgress === 1
                      ? 'Saving key'
                      : 'Generating keys...'}
                  </Progress>
                </div>
              </Dimmer>
              <Form
                onSubmit={e => {
                  e.preventDefault();

                  if (props.loading) {
                    return;
                  }

                  if (form.confirmPassword !== form.password) {
                    alert('The passwords do not match!');
                    return;
                  }

                  props.createAccount(form);
                }}
              >
                <Form.Field required>
                  <label htmlFor="account-name">Account name</label>
                  <Input
                    id="account-name"
                    autoComplete="username"
                    type="text"
                    placeholder="Account name"
                    required
                    minLength={1}
                    value={form.name}
                    onChange={e => this.changed({ name: e.target.value })}
                  />
                </Form.Field>
                <Form.Field required>
                  <label htmlFor="account-description">Account description</label>
                  <TextArea
                    id="account-description"
                    autoComplete="off"
                    placeholder="Account description"
                    required
                    minLength={1}
                    maxLength={1000}
                    value={form.description}
                    onChange={e =>
                      this.changed({ description: (e.target as any).value })
                    }
                  />
                </Form.Field>
                <Form.Field required>
                  <label htmlFor="account-password">Account password</label>
                  <Input
                    id="account-password"
                    autoComplete="new-password"
                    required
                    type="password"
                    placeholder="Account password"
                    value={form.password}
                    onChange={e => this.changed({ password: e.target.value })}
                  />
                </Form.Field>
                <Form.Field
                  required
                  error={
                    form.confirmPassword !== form.password &&
                    form.confirmPassword.length > 0
                  }
                >
                  <label htmlFor="account-confirm-password">
                    Confirm account password
                  </label>
                  <Input
                    id="account-confirm-password"
                    autoComplete="new-password"
                    required
                    type="password"
                    placeholder="Confirm account password"
                    value={form.confirmPassword}
                    onChange={e =>
                      this.changed({ confirmPassword: e.target.value })
                    }
                  />
                </Form.Field>

                <PasswordStrengthMeter password={form.password}/>

                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={submitButton => (this.submitButtonRef = submitButton)}
                />
              </Form>
            </Dimmer.Dimmable>
            <Modal.Actions>
              <Button
                type="button"
                onClick={props.closeCreateAccountDialog}
                disabled={props.loading}
              >
                Cancel
              </Button>
              <Button
                primary
                disabled={props.loading}
                loading={props.loading}
                onClick={() => {
                  this.submitButtonRef!.click();
                }}
              >
                <Icon name="plus"/> Create account
              </Button>
            </Modal.Actions>
          </Modal>
        </TransitionablePortal>
      );
    }
  }
);
