import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../reducers';
import { isExpired, Token, TokenValidator } from '../util/model';
import { showAlert, ShowAlertAction } from './ui-actions';

export interface SetTokenAction extends Action<'SET_TOKEN'> {
  payload: Token;
}

export interface LoggedOutAction extends Action<'LOGGED_OUT'> {
}

export type AuthActions = SetTokenAction | LoggedOutAction;

type AuthThunkAction<R> = ThunkAction<R,
  GlobalState,
  undefined,
  AuthActions | ShowAlertAction>;

export const AUTH_TOKEN_STORAGE_KEY = 'AUTH_TOKEN';

export const setToken: ActionCreator<SetTokenAction> = (token: Token) => {
  return {
    type: 'SET_TOKEN',
    payload: token
  };
};

export const loggedOut: ActionCreator<LoggedOutAction> = () => {
  return { type: 'LOGGED_OUT' };
};

export const getTokenFromStorage: () => AuthThunkAction<void> = () => {
  return dispatch => {
    const storedToken = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (storedToken !== null) {
      try {
        const token = JSON.parse(storedToken);

        if (TokenValidator.checkValid(token) && !isExpired(token)) {
          dispatch(setToken(token));
        } else {
          dispatch(loggedOut());
        }
      } catch (error) {
        console.error('Failed to parse token from storage', error);
        sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      }
    }
  };
};

export const pollLoginState: () => AuthThunkAction<void> = () => {
  return async (dispatch, getState) => {
    setInterval(() => {
      const { auth } = getState();

      if (!auth.isLoggedIn) {
        return;
      }

      if (isExpired(auth.token)) {
        dispatch(loggedOut());
        dispatch(showAlert({
          header: 'Log in expired',
          message: 'Your log in has expired. Please log in again to continue.',
          level: 'info'
        }));
      }
    }, 1000);
  };
};
