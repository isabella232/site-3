import React, { MouseEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { InputProps, Search, SearchProps, SearchResultData } from 'semantic-ui-react';
import styled from 'styled-components';
import { Site, SiteCategory, WORKING_SITES_INFO } from './WorkingSitesInfo';

const StyledSearch = styled(Search)`
  width: 100%;
  
  .input {
    width: 100%;
  }
`;

type SearchInputProps = InputProps & RouteComponentProps;

interface SearchInputState {
  search: string;
  results: CategorizedResults[];
}

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

interface CategorizedResults {
  name: string;
  results: SearchResult[];
}

/**
 * Return sites grouped by their categories
 * @param sites sites to group by category
 */
function sitesByCategory(sites: readonly Site[]): CategorizedResults[] {
  const byCategory: { [category in SiteCategory]?: Site[] } = {};

  sites.forEach(site => byCategory[ site.category ] = (byCategory[ site.category ] || []).concat([ site ]));

  return Object.keys(byCategory).map(
    (category: string) => ({
      name: category,
      results: (byCategory[ category as SiteCategory ] || [])
        .map(site => ({ title: site.name, description: site.description, url: site.url }))
    })
  );
}

const CATEGORIZED_CARDS = sitesByCategory(WORKING_SITES_INFO);

/**
 * Returns true if the target string matches all of the tokens
 * @param targetString target string
 * @param tokens tokens to match
 */
function stringMatch(targetString: string, tokens: string[]): boolean {
  const lowerTarget = targetString.toLowerCase();
  return tokens.length === 0 || tokens.every(token => lowerTarget.indexOf(token) !== -1);
}

/**
 * Return the categorized results matching a search
 * @param value to search on
 */
function matchingSearch(value: string): CategorizedResults[] {
  const tokens = value.split(/\s+/).map(token => token.toLowerCase().trim()).filter(t => t.length > 0);
  if (tokens.length === 0) {
    return CATEGORIZED_CARDS;
  }

  const filtered = WORKING_SITES_INFO.filter(
    site => (site.status.integrated || process.env.NODE_ENV === 'development') &&
      stringMatch(`${site.name} ${site.url} ${site.category}`, tokens)
  );

  return sitesByCategory(filtered);
}

/**
 * Returns true if the keyboard event is an enter press
 * @param e keyboard event
 */
function isEnter(e: KeyboardEvent) {
  return (e.key && e.key === 'Enter') || (e.keyCode && e.keyCode === 13);
}

export default withRouter(class SearchInput extends React.PureComponent<SearchInputProps, SearchInputState> {
  state = {
    search: '',
    results: CATEGORIZED_CARDS
  };

  handleSearchChange = (e: MouseEvent<HTMLElement>, props: SearchProps) => {
    this.setState({
      search: props.value || '',
      results: matchingSearch(props.value || '')
    });
  };

  handleResultSelect = (event: MouseEvent<HTMLDivElement>, data: SearchResultData) => {
    console.log(data);
    const { url } = data.result as Site;

    this.browseToUrl(url);
  };

  browseToUrl = (url: string) => this.props.history.push(`/browse/${encodeURIComponent(url)}`);
  handleEnter = (e: KeyboardEvent) => {
    if (isEnter(e) && this.state.results.length === 1 && this.state.results[ 0 ].results.length === 1) {
      return this.browseToUrl(this.state.results[ 0 ].results[ 0 ].url);
    }
  };

  render() {
    const { search, results } = this.state;

    return (
      <StyledSearch
        {...this.props}
        placeholder="Search for an app"
        id="dapp-search-bar"
        fluid
        value={search}
        onResultSelect={this.handleResultSelect}
        category
        onKeyDown={this.handleEnter}
        results={results}
        onSearchChange={this.handleSearchChange}/>
    );
  }
});