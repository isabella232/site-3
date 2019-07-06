import { createIcon } from '@download/blockies';

const memoizeMap: { [ id: string ]: string } = {};

function getBlockyDataUri(id: string): string {
  return memoizeMap[ id ] || (memoizeMap[ id ] = createIcon({
    seed: id,
    size: 15,
    scale: 3,
  }).toDataURL());
}

export { getBlockyDataUri };