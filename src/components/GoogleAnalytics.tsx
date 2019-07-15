import { useState } from 'react';
import ReactGA from 'react-ga';
import { RouteComponentProps, withRouter } from 'react-router';
import { GOOGLE_ANALYTICS_ID } from '../util/env';

export function initGoogleAnalytics() {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, { debug: process.env.NODE_ENV === 'development' });
}

export enum AnalyticsCategory {
  ACCOUNTS = 'ACCOUNTS',
  ETHEREUM = 'ETHEREUM',
  UI = 'UI',
}

export interface AnalyticsCategoryArgs {
  [ AnalyticsCategory.ACCOUNTS ]: {
    CREATE_ACCOUNT_CLICKED: void;
    DELETE_ACCOUNT: void;
    SHOW_QR_CODE: void;
    COPY_ADDRESS_TO_CLIPBOARD: void;
    VIEW_ON_ETHERSCAN: void;
    CANCEL_UNLOCK: void;
    SUBMIT_PASSWORD_UNLOCK: void;
    EXPORT_KEY_CLICKED: void;
    EDIT_ACCOUNT_CLICKED: void;
    DELETE_ACCOUNT_CLICKED: void;
    LOCK_ACCOUNTS_CLICKED: void;
    UNLOCK_ACCOUNT_CLICKED: void;
  },
  [ AnalyticsCategory.ETHEREUM ]: {
    CHANGE_NETWORK: void;
  }
  [ AnalyticsCategory.UI ]: {
    OPEN_VAULT: void;
    CLOSE_VAULT: void;
    GO_HOME_BUTTON: void;
    SIGN_OUT_BUTTON: void;
    SIGN_IN_BUTTON: void;
    OPEN_VAULT_BUTTON: void;
    CLICK_WORKING_SITE_CARD: void;
    VISIT_URL_VIA_SEARCH_INPUT: void;
    ABOUT_BUTTON_CLICKED: void;
  }
}

/**
 * This signature gives us a function that takes the category, the action and the label if required for the category/action.
 * @param category to track
 * @param action to track
 * @param label to track, optional
 */
export function track<TCategory extends AnalyticsCategory,
  TAction extends keyof AnalyticsCategoryArgs[TCategory] & string>(
  category: TCategory,
  action: TAction,
  label?: string) {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
}

export default withRouter(
  function GoogleAnalytics({ location }: RouteComponentProps) {
    const [ lastPathname, setLastPathname ] = useState<string | null>(null);

    if (lastPathname !== location.pathname) {
      setLastPathname(location.pathname);
      ReactGA.pageview(location.pathname);
    }

    return null;
  }
);