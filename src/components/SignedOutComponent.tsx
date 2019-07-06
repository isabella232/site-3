import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

const EXPECTED_START = '#path=';

export default function SignedOutComponent(props: RouteComponentProps) {
  const hash = props.location.hash;

  let pathname: string = '/';

  if (hash.startsWith(EXPECTED_START)) {
    try {
      pathname = decodeURIComponent(hash.substring(EXPECTED_START.length));
    } catch (error) {
      console.warn('Failed to decode pathname from URL', error);
    }
  }

  return (
    <Redirect
      to={{ pathname }}
      push={false}
    />
  );
}