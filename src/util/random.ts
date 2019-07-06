/**
 * Helper function returns a random ID.
 */
export function randomId(): string {
  return Math.random().toString(36).substr(2, 5);
}