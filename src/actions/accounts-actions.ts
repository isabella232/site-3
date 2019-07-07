import copy from 'copy-to-clipboard';
import download from 'downloadjs';
import { Wallet } from 'ethers';
import { throttle } from 'lodash';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../reducers';
import API, { UnauthenticatedError } from '../util/api';
import { Account } from '../util/model';
import { loggedOut, LoggedOutAction } from './auth-actions';
import { accountChanged, SendMessagesAction } from './ethereum-provider-actions';
import { closeCreateAccountDialog, CloseCreateAccountDialog, showAlert, ShowAlertAction } from './ui-actions';


const PROGRESS_REPORT_THROTTLE_MILLISECONDS = 125;

interface LoadAccountsAction extends Action<'LOAD_ACCOUNTS'> {
}

interface AccountsLoadedAction extends Action<'ACCOUNTS_LOADED'> {
  accounts: Account[];
}

interface LoadAccountsFailed extends Action<'LOAD_ACCOUNTS_FAILED'> {
  error: string;
}

export interface CreateAccountActionParams {
  name: string;
  description: string;
  password: string;
}

interface CreateAccountAction extends Action<'CREATE_ACCOUNT'> {
  params: CreateAccountActionParams;
}

interface CreateAccountWalletGeneratedProgressAction
  extends Action<'CREATE_ACCOUNT_WALLET_GENERATED_PROGRESS'> {
  progress: number;
}

interface CreateAccountSucceeded extends Action<'CREATE_ACCOUNT_SUCCEEDED'> {
  account: Account;
}

interface CreateAccountFailed extends Action<'CREATE_ACCOUNT_FAILED'> {
  error: string;
}

interface DeleteAccountAction extends Action<'DELETE_ACCOUNT'> {
  id: string;
}

interface AccountDeletedAction extends Action<'ACCOUNT_DELETED'> {
  id: string;
}

export type AccountActions =
  | LoadAccountsAction
  | AccountsLoadedAction
  | LoadAccountsFailed
  | CreateAccountAction
  | CreateAccountSucceeded
  | CreateAccountFailed
  | CreateAccountWalletGeneratedProgressAction
  | UnlockAccountAction
  | UnlockAccountErrorAction
  | UnlockAccountProgressAction
  | UnlockAccountSuccessAction
  | LockAccountsAction
  | ExportKeyAction
  | KeyExportedAction
  | DeleteAccountAction
  | AccountDeletedAction
  | ShowQrCodeAction
  | DismissShowQrCodeAction;

type AccountThunkAction<R> = ThunkAction<R,
  GlobalState,
  undefined,
  AccountActions | LoggedOutAction | CloseCreateAccountDialog | ShowAlertAction | SendMessagesAction>;

export const loadAccounts: () => AccountThunkAction<void> = () => {
  return async (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      throw new Error('Token should not be null');
    }

    dispatch({
      type: 'LOAD_ACCOUNTS'
    });

    try {
      const accounts = await API.getAccounts(token);
      dispatch({ type: 'ACCOUNTS_LOADED', accounts });
    } catch (error) {
      dispatch({ type: 'LOAD_ACCOUNTS_FAILED', error: error.message });
      if (error instanceof UnauthenticatedError) {
        dispatch(loggedOut());
      }
    }
  };
};

export interface UnlockAccountAction extends Action<'UNLOCK_ACCOUNT'> {
  id: string;
}

export interface ExportKeyAction extends Action<'EXPORT_KEY'> {
  id: string;
}

export interface KeyExportedAction extends Action<'KEY_EXPORTED'> {
  id: string;
}

export interface ShowQrCodeAction extends Action<'SHOW_QR_CODE'> {
  id: string;
}

export interface DismissShowQrCodeAction extends Action<'DISMISS_SHOW_QR_CODE'> {
}

export interface UnlockAccountProgressAction
  extends Action<'UNLOCK_ACCOUNT_PROGRESS'> {
  id: string;
  progress: number;
}

export interface UnlockAccountErrorAction
  extends Action<'UNLOCK_ACCOUNT_ERROR'> {
  id: string;
  error: string;
}

export interface UnlockAccountSuccessAction
  extends Action<'UNLOCK_ACCOUNT_SUCCESS'> {
  id: string;
  privateKey: string;
  address: string;
}

export interface LockAccountsAction extends Action<'LOCK_ACCOUNTS'> {
}

export function lockAccounts(): AccountThunkAction<void> {
  return (dispatch) => {
    dispatch({ type: 'LOCK_ACCOUNTS' });
    dispatch(accountChanged(null));
    dispatch(showAlert({
      level: 'info',
      message: 'Your accounts are all locked.',
      header: 'Accounts locked'
    }));
  };
}

export const exportKey: (id: string) => AccountThunkAction<void> = id => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'EXPORT_KEY',
      id
    });

    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      throw new Error('Token should not be null');
    }

    const account = await API.getAccountWithEncryptedJson(id, token);

    if (getState().accounts.exportingAccountId !== id) {
      return;
    }

    const jsonString = JSON.stringify(account.encryptedJson);

    download(jsonString, `${account.name} Key.json`, 'application/json');

    dispatch({ type: 'KEY_EXPORTED', id });
  };
};

export const unlockAccount: (
  id: string,
  password: string
) => AccountThunkAction<void> = (id, password) => {
  return async (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      throw new Error('Token should not be null');
    }

    if (getState().accounts.unlockedAccount.progress.loading) {
      throw new Error('Unlocking in progress.');
    }

    dispatch({
      type: 'UNLOCK_ACCOUNT',
      id
    });

    try {
      const fullAccount = await API.getAccountWithEncryptedJson(id, token);

      const throttledReportProgress = throttle((progress: number) => dispatch({
        type: 'UNLOCK_ACCOUNT_PROGRESS',
        id,
        progress
      }), PROGRESS_REPORT_THROTTLE_MILLISECONDS);

      const wallet = await Wallet.fromEncryptedJson(
        JSON.stringify(fullAccount.encryptedJson),
        password,
        progress => {
          throttledReportProgress(progress);

          return false;
        }
      );

      throttledReportProgress.cancel();

      dispatch({
        type: 'UNLOCK_ACCOUNT_SUCCESS',
        id,
        privateKey: wallet.privateKey,
        address: wallet.address
      });

      // TODO: Dispatch an event to child iframe to indicate the accounts changed.

      dispatch(
        showAlert({
          header: `Unlocked account`,
          message:
            'You may now use this account with a supported application.',
          level: 'success'
        })
      );

      dispatch(accountChanged(wallet.address));
    } catch (error) {
      console.error('Failed to unlock account', id, error);

      dispatch({
        type: 'UNLOCK_ACCOUNT_ERROR',
        id,
        error: error.message
      });

      dispatch(
        showAlert({
          header: 'Failed to unlock account',
          message:
            `The following error was encountered while trying to unlock the account: ${error.message}`,
          level: 'error'
        })
      );

      if (error instanceof UnauthenticatedError) {
        dispatch(loggedOut());
      }
    }
  };
};

export const showQrCode: (id: string) => AccountThunkAction<void> = id => {
  return (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      dispatch(
        showAlert({
          header: 'Not signed in',
          message: 'You must be signed in to delete an account.',
          level: 'error'
        })
      );
      return;
    }

    if (!getState().accounts.accounts.find(account => account.id === id)) {
      dispatch(showAlert({
        header: 'Failed to show QR code',
        message: 'Account with specified ID could not be found',
        level: 'error'
      }));
      return;
    }

    dispatch({
      type: 'SHOW_QR_CODE',
      id,
    });
  };
};

export function dismissShowQrCode(): DismissShowQrCodeAction {
  return {
    type: 'DISMISS_SHOW_QR_CODE'
  };
}

export const deleteAccount: (id: string) => AccountThunkAction<void> = id => {
  return async (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      dispatch(
        showAlert({
          header: 'Not signed in',
          message: 'You must be signed in to delete an account.',
          level: 'error'
        })
      );
      return;
    }

    const account = getState().accounts.accounts.find(account => account.id === id);
    if (!account) {
      dispatch(
        showAlert({
          header: 'Failed to delete account',
          message: 'The account with the specified ID does not exist',
          level: 'error'
        })
      );
      return;
    }

    dispatch({
      type: 'DELETE_ACCOUNT',
      id,
    });

    try {
      await API.deleteAccount(id, token);

      dispatch({
        type: 'ACCOUNT_DELETED',
        id
      });

      dispatch(
        showAlert({
          header: `Account "${account.name}" deleted`,
          message:
            'Your account has been permanently deleted. Your keys will be evicted from the service within a week. Contact support as soon as possible if this was an accident.',
          level: 'warning'
        })
      );
    } catch (error) {
      dispatch(
        showAlert({
          header: 'Failed to delete account',
          message:
            'An error occurred while trying to delete your account. Please contact support if the issue persists.',
          level: 'error'
        })
      );
    }
  };
};

export const copyAddressToClipboard: (
  id: string
) => AccountThunkAction<void> = id => {
  return async (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      dispatch(
        showAlert({
          header: 'Not signed in',
          message: 'You must be signed in to copy an address to clipboard.',
          level: 'error'
        })
      );
      return;
    }

    const account = getState().accounts.accounts.find(account => account.id === id);

    if (!account) {
      dispatch(
        showAlert({
          header: 'Failed to copy to clipboard',
          message: 'The account ID is not valid.',
          level: 'error'
        })
      );
      return;
    }

    if (copy(account.address)) {
      dispatch(showAlert({
        level: 'success',
        header: `Copied address for account "${account.name}"`,
        message: 'The account address has been copied to the clipboard.'
      }));
    } else {
      dispatch(showAlert({
        level: 'error',
        header: 'Failed to copy to clipboard',
        message: 'Sorry, your browser does not support copying to clipboard.'
      }));
    }
  };
};

export const createAccount: (
  params: CreateAccountActionParams
) => AccountThunkAction<void> = params => {
  return async (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) {
      return;
    }

    const token = getState().auth.token;

    if (token === null) {
      dispatch(
        showAlert({
          header: 'Not signed in',
          message: 'You must be signed in to create an account.',
          level: 'error'
        })
      );
      return;
    }

    if (getState().accounts.createAccount.loading) {
      dispatch(
        showAlert({
          header: 'Cannot do that right now',
          message: 'You can only unlock a single account at a time.',
          level: 'error'
        })
      );
      return;
    }

    dispatch({
      type: 'CREATE_ACCOUNT',
      params: params
    });

    const newWallet = Wallet.createRandom();

    const throttledReportProgress = throttle((progress: number) => {
      dispatch({
        type: 'CREATE_ACCOUNT_WALLET_GENERATED_PROGRESS',
        progress
      });
    }, PROGRESS_REPORT_THROTTLE_MILLISECONDS);

    const encryptedJson = JSON.parse(
      await newWallet.encrypt(params.password, {}, (progress: number) => {
        throttledReportProgress(progress);

        // We must return false to not cancel the generation.
        return false;
      })
    );

    throttledReportProgress.cancel();

    dispatch({
      type: 'CREATE_ACCOUNT_WALLET_GENERATED_PROGRESS',
      progress: 1
    });

    try {
      const account = await API.createAccount(
        {
          name: params.name,
          description: params.description,
          encryptedJson
        },
        token
      );

      dispatch({ type: 'CREATE_ACCOUNT_SUCCEEDED', account });

      dispatch(
        showAlert({
          header: `Created account: "${account.name}"`,
          message:
            'Your account has been created. Remember to write down your password and back up your keys somewhere safe.',
          level: 'success'
        })
      );

      dispatch(closeCreateAccountDialog());
    } catch (error) {
      dispatch({ type: 'CREATE_ACCOUNT_FAILED', error: error.message });

      if (error instanceof UnauthenticatedError) {
        dispatch(
          showAlert({
            header: 'You are logged out',
            message:
              'Sorry, we couldn\'t create your account because you are logged out.',
            level: 'error'
          })
        );

        dispatch(loggedOut());
      } else {
        dispatch(
          showAlert({
            header: 'Account creation failed',
            message:
              'Something went wrong. Please contact support for help with your issue.',
            level: 'error'
          })
        );
      }
    }
  };
};
