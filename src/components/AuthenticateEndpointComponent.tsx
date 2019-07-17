import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { setToken } from '../actions/auth-actions';
import { Token } from '../util/model';
import { AUTH_FLOW_STATE_LOCAL_STORAGE_KEY, STATE_SEPARATOR } from './SignInButton';

/**
 * Parse a token from the URL hash
 * @param hash from the URL
 */
function parseToken(hash: string): Token {
  const pieces = hash.substring(1).split('&');

  const hashObject = pieces
    .map(s => s.split('='))
    .map<{ [ key: string ]: number | string }>(([ key, value ]) => {
      try {
        const decodedKey = decodeURIComponent(key);
        const decodedValue = decodeURIComponent(value);

        if (/^[0-9]+$/.test(decodedValue)) {
          return { [ decodedKey ]: +decodedValue };
        }

        return { [ decodedKey ]: decodedValue };
      } catch (error) {
        console.error('Failed to decode a key/value pair from the hash', error);
        return {};
      }
    })
    .reduce((previousValue, currentValue) => ({
      ...previousValue,
      ...currentValue
    }));

  if (
    typeof hashObject.access_token !== 'string' ||
    typeof hashObject.expires_in !== 'number' ||
    hashObject.token_type !== 'Bearer'
  ) {
    throw new Error(
      `Parsed token did not have expected structure: ${JSON.stringify(
        hashObject
      )}`
    );
  }

  const expectedState = sessionStorage.getItem(
    AUTH_FLOW_STATE_LOCAL_STORAGE_KEY
  );

  if (hashObject.state !== expectedState) {
    throw new Error(`State mismatch: ${hashObject.state} !== ${expectedState}`);
  }

  return hashObject as any;
}

export default connect(
  null,
  { setToken }
)(function AuthenticateEndpointComponent(
  props: RouteComponentProps & { setToken: typeof setToken }
) {
  const hash = window.location.hash;

  if (hash.length !== 0) {
    try {
      const tokenInfo = parseToken(hash);

      props.setToken(tokenInfo);

      const statePieces = tokenInfo.state.split(STATE_SEPARATOR);

      return (
        <Redirect push={false} to={{ pathname: statePieces[ 1 ], hash: statePieces[ 2 ] }}/>
      );
    } catch (error) {
      console.error('Invalid hash for token', error, hash);
    }
  }

  // By default just return to the home page.
  return <Redirect push={false} to={{ pathname: '/', hash: '' }}/>;
});
