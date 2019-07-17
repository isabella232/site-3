import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

export default function SignedOutComponent(props: RouteComponentProps) {
  const hash = props.location.hash;

  let location: string = '/';

  try {
    location = decodeURIComponent(hash.substring(1));
  } catch (error) {
    console.warn('Failed to decode pathname from URL', error);
  }

  return (
    <Redirect
      to={location}
      push={false}
    />
  );
}