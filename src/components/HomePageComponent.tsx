import { reduce } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container } from 'semantic-ui-react';
import DocumentTitle from './DocumentTitle';
import SearchInput from './SearchInput';
import WorkingSiteCards from './WorkingSiteCards';

function parseSearch(hash: string): string {
  if (hash.length < 2 || !hash.startsWith('#')) {
    return '';
  }

  const hashObject = reduce<string, { [ param: string ]: string }>(hash.substring(1).split('&'), (memo, curr) => {
    const split = curr.split('=');
    if (split.length === 1) {
      memo[ decodeURIComponent(split[ 0 ]) ] = '';
    } else if (split.length === 2) {
      memo[ decodeURIComponent(split[ 0 ]) ] = decodeURIComponent(split[ 1 ]);
    }
    return memo;
  }, {});

  return hashObject[ 'search' ] || '';
}

export default function HomePageComponent(props: RouteComponentProps) {
  const search = parseSearch(props.location.hash);

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <DocumentTitle title="Home"/>

      <SearchInput
        value={search}
        onChange={({ target: { value } }) => props.history.replace({
          ...props.location,
          hash: `search=${encodeURIComponent(value)}`
        })}
      />

      <WorkingSiteCards search={search}/>
    </Container>
  );
}
