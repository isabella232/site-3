/**
 * Return true if the URL is valid and should be rendered in the iframe.
 * @param url to check
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return !!parsed.host && !!parsed.protocol;
  } catch (error) {
    return false;
  }
}

export function getValidUrl(userEnteredUrl: string): string | null {
  if (userEnteredUrl.length === 0) {
    return null;
  }

  if (isValidUrl(userEnteredUrl)) {
    return userEnteredUrl;
  } else if (isValidUrl(`https://${userEnteredUrl}`)) {
    return `https://${userEnteredUrl}`;
  } else {
    return null;
  }
}

export function canBeValidUrl(userEnteredUrl: string): boolean {
  return getValidUrl(userEnteredUrl) !== null;
}
