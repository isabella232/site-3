import { Action, ActionCreator } from 'redux';
import { Token } from '../util/model';

export interface SetTokenAction extends Action<'SET_TOKEN'> {
  payload: Token;
}

export interface LoggedOutAction extends Action<'LOGGED_OUT'> {
}

export type AuthActions = SetTokenAction | LoggedOutAction;

export const setToken: ActionCreator<SetTokenAction> = (token: Token) => {
  return {
    type: 'SET_TOKEN',
    payload: token
  };
};

export const loggedOut: ActionCreator<LoggedOutAction> = () => {
  return { type: 'LOGGED_OUT' };
};
