import { sortBy } from 'lodash';
import { Site, VISIBLE_SITES } from './sites-info';

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
 * @param q to search on
 */
export default function searchSites(q: string): Site[] {
  const tokens = q.split(/\s+/).map(token => token.toLowerCase().trim()).filter(t => t.length > 0);

  let filtered: Site[] = VISIBLE_SITES;

  if (tokens.length > 0) {
    filtered = VISIBLE_SITES.filter(
      site => stringMatch(`${site.name} ${site.url} ${site.category}`, tokens)
    );
  }

  return sortBy(sortBy(filtered, site => site.name), (site) => !site.status.integrated);
}