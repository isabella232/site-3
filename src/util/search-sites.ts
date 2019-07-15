import { groupBy, map } from 'lodash';
import { VISIBLE_SITES, Site, SiteCategory } from './sites-info';

interface CategorizedResults {
  readonly category: SiteCategory;
  readonly results: Site[];
}

/**
 * Return sites grouped by their categories
 * @param sites sites to group by category
 */
function sitesByCategory(sites: readonly Site[]): CategorizedResults[] {
  return map(groupBy(sites, site => site.category), (results, category) => ({
    results,
    category: category as SiteCategory
  }));
}

const CATEGORIZED_CARDS = sitesByCategory(VISIBLE_SITES);

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
export default function searchSites(q: string): CategorizedResults[] {
  const tokens = q.split(/\s+/).map(token => token.toLowerCase().trim()).filter(t => t.length > 0);
  if (tokens.length === 0) {
    return CATEGORIZED_CARDS;
  }

  const filtered = VISIBLE_SITES.filter(
    site => stringMatch(`${site.name} ${site.url} ${site.category}`, tokens)
  );

  return sitesByCategory(filtered);
}