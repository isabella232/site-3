import { Reducer } from 'redux';
import { AuthActions } from '../actions/auth-actions';
import { Token } from '../util/model';

export interface AuthState {
  isLoggedIn: boolean;
  token: Token | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null
};

export const authReducer: Reducer<AuthState, AuthActions> =
  (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TOKEN':
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