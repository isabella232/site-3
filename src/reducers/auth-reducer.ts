import { Reducer } from 'redux';
import { AUTH_TOKEN_STORAGE_KEY, AuthActions } from '../actions/auth-actions';
import { Token } from '../util/model';

export type AuthState = {
  isLoggedIn: true;
  token: Token;
} | {
  isLoggedIn: false;
  token: null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null
};

export const authReducer: Reducer<AuthState, AuthActions> =
  (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TOKEN':
        sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(action.payload));

        return {
          isLoggedIn: true,
          token: action.payload
        };

      case 'LOGGED_OUT':
        localStorage.clear();
        sessionStorage.clear();

        return initialState;

      default:
        return state;
    }
  };