import { Action, ActionCreator } from 'redux';
import { randomId } from '../util/random';

export interface OpenSidebarAction extends Action<'OPEN_SIDEBAR'> {
}

export interface CloseSidebarAction extends Action<'CLOSE_SIDEBAR'> {
}

export type AlertLevel = 'error' | 'success' | 'warning' | 'info';

export interface ShowAlertAction extends Action<'SHOW_ALERT'> {
  id: string;
  header: string;
  message: string;
  level: AlertLevel;
  moreInfoUrl: string | null;
}

export interface DismissAlertAction extends Action<'DISMISS_ALERT'> {
  id: string;
}

export interface ClearAlertsAction extends Action<'CLEAR_ALERTS'> {
}

export const openSidebar: ActionCreator<OpenSidebarAction> = () => {
  return {
    type: 'OPEN_SIDEBAR'
  };
};

export const closeSidebar: ActionCreator<CloseSidebarAction> = () => {
  return { type: 'CLOSE_SIDEBAR' };
};

export interface OpenCreateAccountDialog extends Action<'OPEN_CREATE_ACCOUNT_DIALOG'> {
}

export const openCreateAccountDialog: ActionCreator<OpenCreateAccountDialog> = () => {
  return {
    type: 'OPEN_CREATE_ACCOUNT_DIALOG',
  };
};

interface ShowAlertInput {
  header: string;
  message: string;
  level: AlertLevel;
  moreInfoUrl?: string | null;
}

export function showAlert({ header, message, level = 'info', moreInfoUrl = null }: ShowAlertInput): ShowAlertAction {
  return {
    type: 'SHOW_ALERT',
    id: randomId(),
    level,
    header,
    message,
    moreInfoUrl
  };
}

export function dismissAlert(id: string) {
  return { type: 'DISMISS_ALERT', id };
}

export function clearAlerts() {
  return { type: 'CLEAR_ALERTS' };
}

export interface CloseCreateAccountDialog extends Action<'CLOSE_CREATE_ACCOUNT_DIALOG'> {
}

export function closeCreateAccountDialog(): CloseCreateAccountDialog {
  return {
    type: 'CLOSE_CREATE_ACCOUNT_DIALOG',
  };
}

export type UIActions =
  OpenSidebarAction
  | CloseSidebarAction
  | OpenCreateAccountDialog
  | CloseCreateAccountDialog
  | ShowAlertAction
  | DismissAlertAction
  | ClearAlertsAction;
