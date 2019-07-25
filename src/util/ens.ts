import { InfuraProvider } from 'ethers/providers';
import { INFURA_KEY } from './env';
import { NetworkId, NETWORKS_INFO } from './networks';

/**
 * Return true if the value is a valid string address
 * @param value true if the value is a valid address
 */
export function isValidAddress(value: any) {
  return typeof value === 'string' && value.length > 0 && /^0x[a-fA-F0-9]{40}$/.test(value);
}

/**
 * Reverse lookup the ens name corresponding to some address for a particular network, or the mainnet if the
 * network doesn't have ENS
 * @param network network to resolve address for
 * @param address address to look up
 */
export async function reverseLookupAddress(network: NetworkId, address: string): Promise<string | null> {
  if (!isValidAddress(address)) {
    return null;
  }

  const networkInfo = NETWORKS_INFO[ network ];

  if (networkInfo.ensAddress === null) {
    return null;
  }

  try {
    // TODO: replace this with something lower level
    // We already have a client.
    const client = new InfuraProvider(network, INFURA_KEY);

    return await client.lookupAddress(address);
  } catch (error) {
    console.debug(`Failed to look up address in ENS: ${address}`, error);
    return null;
  }
}

export async function lookupEnsName(network: NetworkId, name: string): Promise<string | null> {
  name = name.toLowerCase();

  const networkInfo = NETWORKS_INFO[ network ];

  if (networkInfo.ensAddress === null) {
    return null;
  }

  try {
    // TODO: replace this with something lower level
    // We already have a client.
    const client = new InfuraProvider(network, INFURA_KEY);

    return await client.resolveName(name);
  } catch (error) {
    console.debug(`Failed to look up ENS name: ${name}`, error);
    return null;
  }
}