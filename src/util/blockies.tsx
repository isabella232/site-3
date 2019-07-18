import { createIcon } from '@download/blockies';
import { memoize } from 'lodash';

const getBlockyDataUri: (id: string) => string = memoize((id) => {
  return createIcon({
    seed: id,
    size: 15,
    scale: 3,
  }).toDataURL();
});

export { getBlockyDataUri };