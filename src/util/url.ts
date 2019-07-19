import { memoize } from 'lodash';

const HTTPS_PREFIX = 'https://';

/**
 * Return the URL corresponding to a given key or false if it's not valid
 * @param value to check
 */
export const getValidUrl = memoize(function (value: string): URL | false {
  try {
    const parsed = new URL(value);

    if (!!parsed.host &&
      !!parsed.protocol &&
      parsed.hostname.split('.').every(pc => pc.length > 0)) {
      return parsed;
    }
  } catch (error) {
    if (!value.startsWith(HTTPS_PREFIX)) {
      return getValidUrl(`${HTTPS_PREFIX}${value}`);
    }
  }

  return false;
});

export function canBeValidUrl(userEnteredUrl: string): boolean {
  return getValidUrl(userEnteredUrl) !== null;
}
