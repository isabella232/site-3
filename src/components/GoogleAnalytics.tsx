import { useState } from 'react';
import ReactGA from 'react-ga';
import { RouteComponentProps, withRouter } from 'react-router';
import { GOOGLE_ANALYTICS_ID } from '../util/env';

ReactGA.initialize(GOOGLE_ANALYTICS_ID, { debug: process.env.NODE_ENV === 'development' });

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