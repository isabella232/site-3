import * as React from 'react';
import { KeyboardEvent } from 'react';
import { Route } from 'react-router';
import { Input, InputProps } from 'semantic-ui-react';
import { canBeValidUrl } from '../util/url';

export default class UrlSearchInput extends React.PureComponent<InputProps, { search: string; }> {
  state = {
    search: ''
  };

  render() {
    const { search } = this.state;
    return (
      <Route>
        {
          ({ history }) => (
            <Input
              {...this.props}
              placeholder="Enter a URL"
              label="https://"
              type="url"
              fluid
              id="url-entry-input"
              action={{
                color: 'blue',
                icon: 'angle right',
                onClick: () => history.push(`/browse/${encodeURIComponent(this.state.search)}`),
                disabled: !canBeValidUrl(search)
              }}
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                  history.push(`/browse/${encodeURIComponent(search)}`);
                }
              }}
            />
          )
        }
      </Route>
    );
  }
}