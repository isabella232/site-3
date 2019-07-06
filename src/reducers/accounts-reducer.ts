import { Reducer } from 'redux';
import { AccountActions } from '../actions/accounts-actions';
import { LoggedOutAction } from '../actions/auth-actions';
import { Account } from '../util/model';

interface UnlockedAccountInfo {
  id: string;
  address: string;
  privateKey: string;
}

interface UnlockAccountProgress {
  loading: boolean;
  success: boolean;
  walletDecryptProgress: number;
  error: string | null;
  id: string | null;
}

export interface AccountsState {
  accounts: Account[];
  isLoading: boolean;
  loadError: null | string;

  createAccount: {
    loading: boolean;
    walletEncryptProgress: number;
    error: string | null;
  };

  unlockedAccount: {
    progress: UnlockAccountProgress;
    info: UnlockedAccountInfo | null;
  }

  exportingAccountId: string | null;
  deletingAccountId: string | null;
  showingQrCodeAccountId: string | null;
}

const initialState: Readonly<AccountsState> = {
  accounts: [],
  isLoading: false,
  loadError: null,

  createAccount: {
    loading: false,
    walletEncryptProgress: 0,
    error: null,
  },

  unlockedAccount: {
    progress: {
      loading: false,
      success: false,
      walletDecryptProgress: 0,
      error: null,
      id: null,
    },
    info: null
  },

  exportingAccountId: null,
  deletingAccountId: null,
  showingQrCodeAccountId: null,
};

export const accountsReducer: Reducer<AccountsState, AccountActions | LoggedOutAction> =
  (
    state = initialState,
    action
  ) => {
    switch (action.type) {
      case 'LOGGED_OUT':
        return initialState;

      case 'LOAD_ACCOUNTS':
        if (state.isLoading) {
          return state;
        }

        return {
          ...state,
          isLoading: true,
          loadError: null
        };

      case 'ACCOUNTS_LOADED':
        return {
          ...state,
          isLoading: false,
          accounts: action.accounts,
          loadError: null,
        };

      case 'LOAD_ACCOUNTS_FAILED':
        return {
          ...state,
          isLoading: false,
          loadError: action.error
        };

      case 'CREATE_ACCOUNT':
        return {
          ...state,
          createAccount: {
            ...state.createAccount,
            loading: true,
            walletEncryptProgress: 0,
            error: null
          }
        };

      case 'CREATE_ACCOUNT_FAILED':
        return {
          ...state,
          createAccount: {
            ...state.createAccount,
            loading: false,
            error: null
          }
        };

      case 'CREATE_ACCOUNT_WALLET_GENERATED_PROGRESS':
        return {
          ...state,
          createAccount: {
            ...state.createAccount,
            walletEncryptProgress: action.progress,
            error: null
          }
        };

      case 'CREATE_ACCOUNT_SUCCEEDED':
        return {
          ...state,
          accounts: [
            ...state.accounts,
            action.account
          ],
          createAccount: {
            ...state.createAccount,
            loading: false,
            error: null
          }
        };

      case 'UNLOCK_ACCOUNT':
        return {
          ...state,
          unlockedAccount: {
            ...state.unlockedAccount,
            progress: {
              success: false,
              loading: true,
              id: action.id,
              walletDecryptProgress: 0,
              error: null
            }
          }
        };

      case 'UNLOCK_ACCOUNT_ERROR':
        return {
          ...state,
          unlockedAccount: {
            ...state.unlockedAccount,
            progress: {
              ...state.unlockedAccount.progress,
              loading: false,
              success: false,
              error: action.error,
            }
          }
        };

      case 'UNLOCK_ACCOUNT_PROGRESS':
        return {
          ...state,
          unlockedAccount: {
            ...state.unlockedAccount,
            progress: {
              ...state.unlockedAccount.progress,
              walletDecryptProgress: action.progress
            }
          }
        };

      case 'UNLOCK_ACCOUNT_SUCCESS':
        return {
          ...state,
          unlockedAccount: {
            ...state.unlockedAccount,
            progress: {
              ...state.unlockedAccount.progress,
              loading: false,
              success: true,
            },
            info: {
              id: action.id,
              privateKey: action.privateKey,
              address: action.address,
            }
          }
        };

      case 'EXPORT_KEY':
        return {
          ...state,
          exportingAccountId: action.id,
        };

      case 'DELETE_ACCOUNT':
        return {
          ...state,
          deletingAccountId: action.id
        };

      case 'ACCOUNT_DELETED':
        return {
          ...state,
          accounts: state.accounts.filter(({ id }) => id !== action.id),
          deletingAccountId: null
        };

      case 'KEY_EXPORTED':
        return {
          ...state,
          exportingAccountId: null
        };

      case 'LOCK_ACCOUNTS':
        return {
          ...state,
          unlockedAccount: {
            ...state.unlockedAccount,
            info: null
          }
        };

      case 'SHOW_QR_CODE':
        return {
          ...state,
          showingQrCodeAccountId: action.id,
        };

      case 'DISMISS_SHOW_QR_CODE':
        return {
          ...state,
          showingQrCodeAccountId: null,
        };

      default:
        return state;
    }
  };