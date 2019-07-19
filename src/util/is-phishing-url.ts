import checkForPhishing from 'eth-phishing-detect';

/**
 * Determine whether the URL is a phishing URL.
 * @param url to validate
 */
export default function isPhishingUrl(url: URL): boolean {
  return checkForPhishing(url.host);
}