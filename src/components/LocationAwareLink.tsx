import React from 'react';
import { Link, LinkProps, Route } from 'react-router-dom';

/**
 * A link component that preserves unspecified parts of the path. If this behavior is not desired,
 * use the regular link.
 * @param props link props
 */
export default function LocationAwareLink(props: LinkProps) {
  return (
    <Route>
      {
        ({ location }) =>
          <Link
            {...props}
            to={typeof props.to === 'string' ? props.to : { ...location, ...props.to }}
          />
      }
    </Route>
  );
}