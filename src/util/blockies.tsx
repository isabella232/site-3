import { createIcon } from '@download/blockies';
import { memoize } from 'lodash';
import { DISABLE_BLOCKIES } from './env';

/**
 * Return the data URI corresponding to the blocky for this id
 */
const getBlockyDataUri: (seed: string) => string = memoize(seed => {
  if (DISABLE_BLOCKIES) {
    return '';
  }

  return createIcon({
    seed: seed,
    size: 15,
    scale: 3,
  }).toDataURL();
});

export { getBlockyDataUri };