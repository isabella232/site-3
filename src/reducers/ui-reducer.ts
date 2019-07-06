import { Reducer } from 'redux';
import { LoggedOutAction } from '../actions/auth-actions';
import { AlertLevel, UIActions } from '../actions/ui-actions';

export interface Alert {
  id: string;
  header: string;
  message: string;
  level: AlertLevel;
  moreInfoUrl: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  createAccountOpen: boolean;

  alerts: Alert[];
}

const initialState: UIState = {
  sidebarOpen: false,
  createAccountOpen: false,
  alerts: []
};

export const uiReducer: Reducer<UIState, UIActions | LoggedOutAction> =
  (state = initialState, action) => {
    switch (action.type) {
      case 'OPEN_SIDEBAR':
        return {
          ...state,
          sidebarOpen: true
        };

      case 'CLOSE_SIDEBAR':
        return {
          ...state,
          sidebarOpen: false
        };

      case 'OPEN_CREATE_ACCOUNT_DIALOG':
        return {
          ...state,
          createAccountOpen: true,
        };

      case 'CLOSE_CREATE_ACCOUNT_DIALOG':
        return {
          ...state,
          createAccountOpen: false,
        };

      case 'SHOW_ALERT':
        return {
          ...state,
          alerts: [
            ...state.alerts,
            {
              id: action.id,
              message: action.message,
              header: action.header,
              level: action.level,
              moreInfoUrl: action.moreInfoUrl,
            }
          ]
        };

      case 'DISMISS_ALERT':
        return {
          ...state,
          alerts: state.alerts.filter(
            alert => alert.id !== action.id
          )
        };

      case 'CLEAR_ALERTS':
        return {
          ...state,
          alerts: []
        };

      default:
        return state;
    }
  };