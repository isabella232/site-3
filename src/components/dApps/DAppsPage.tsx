import { reduce } from 'lodash';
import * as React from 'react';
import { createRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Header } from 'semantic-ui-react';
import DocumentTitle from '../DocumentTitle';
import SearchInput from '../SearchInput';
import HeaderFont from '../HeaderFont';
import WorkingSiteCards from '../WorkingSiteCards';

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

export default class dAppsPage extends React.Component<RouteComponentProps> {
  private searchRef = createRef<SearchInput>();

  interceptSearchToFocusSearchInput = (e: KeyboardEvent) => {
    if (!this.searchRef.current) {
      return;
    }

    if (
      ((e.ctrlKey || e.metaKey) && !e.shiftKey) &&
      (e.key === 'F' || e.key === 'f' || e.keyCode === 70)
    ) {
      this.searchRef.current.focus();
      e.preventDefault();
    }
  };

  componentDidMount(): void {
    window.addEventListener('keydown', this.interceptSearchToFocusSearchInput);
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.interceptSearchToFocusSearchInput);
  }

  render() {
    const { location, history } = this.props;

    const search = parseSearch(location.hash);

    return (
      <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <DocumentTitle title="dApps"/>
        <label>
          <Header as="h1"><HeaderFont>ETHVAULT</HeaderFont></Header>

          <SearchInput
            value={search}
            size="huge"
            ref={this.searchRef}
            onChange={({ target: { value } }) => history.replace({
              ...location,
              hash: `search=${encodeURIComponent(value)}`
            })}
          />
        </label>

        <WorkingSiteCards search={search}/>
      </Container>
    );
  }
}
