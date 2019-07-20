import React, { useEffect, useRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import findScrollParent from '../util/find-scroll-parent';

/**
 * A component that scrolls its scroll parent to the top of the page on navigation
 */
export default withRouter(function ScrollToTop({ history, location }: RouteComponentProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (history.action === 'PUSH' && ref.current) {
      const scrollParent = findScrollParent(ref.current);
      if (scrollParent) {
        if (scrollParent.scrollTo) {
          scrollParent.scrollTo({ behavior: 'auto', top: 0 });
        } else {
          scrollParent.scrollTop = 0;
        }
      }
    }
  }, [ history.action, location.pathname ]);

  return <span style={{ visibility: 'hidden' }} ref={ref}/>;
});