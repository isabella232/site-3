import { combineReducers, Reducer } from 'redux';
import { accountsReducer, AccountsState } from './accounts-reducer';
import { authReducer, AuthState } from './auth-reducer';
import { ethereumProviderReducer, EthereumProviderState } from './ethereum-provider-reducer';
import { uiReducer, UIState } from './ui-reducer';

export interface GlobalState {
  auth: AuthState;
  accounts: AccountsState;
  ui: UIState;
  ethereumProvider: EthereumProviderState;
}

export const rootReducer: Reducer<GlobalState> = combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  ui: uiReducer,
  ethereumProvider: ethereumProviderReducer,
});