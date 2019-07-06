// The supported network options.
import { InfuraProvider } from 'ethers/providers';
import { INFURA_KEY } from './env';

export type NetworkId = 'mainnet' | 'ropsten' | 'rinkeby' | 'kovan';

// Information about an individual network.
export interface NetworkInfo {
  displayName: string;
  chainId: string;
  networkId: string;
  nodeUrl: string;
  ensAddress: string | null;
  etherscanBaseUrl: string;
}

// The network information by identifier
export type NetworksInfo = { [networkName in NetworkId]: NetworkInfo };
export const NETWORKS_INFO: NetworksInfo = {
  mainnet: {
    displayName: 'Mainnet',
    chainId: '1',
    networkId: '1',
    ensAddress: '0x314159265dD8dbb310642f98f50C066173C1259b',
    nodeUrl: `https://mainnet.infura.io/${INFURA_KEY}`,
    etherscanBaseUrl: `https://etherscan.io`,
  },
  ropsten: {
    displayName: 'Ropsten',
    chainId: '3',
    networkId: '3',
    ensAddress: null,
    nodeUrl: `https://ropsten.infura.io/${INFURA_KEY}`,
    etherscanBaseUrl: `https://ropsten.etherscan.io`,
  },
  rinkeby: {
    displayName: 'Rinkeby',
    chainId: '4',
    networkId: '4',
    ensAddress: null,
    nodeUrl: `https://rinkeby.infura.io/${INFURA_KEY}`,
    etherscanBaseUrl: `https://rinkeby.etherscan.io`,
  },
  kovan: {
    displayName: 'Kovan',
    chainId: '42',
    networkId: '42',
    ensAddress: null,
    nodeUrl: `https://kovan.infura.io/${INFURA_KEY}`,
    etherscanBaseUrl: `https://kovan.etherscan.io`,
  }
};

const providers: { [networkName in NetworkId]?: InfuraProvider } = {};

/**
 * Get a provider for the given network
 * @param network network for which to get the provider
 */
export function getProvider(network: NetworkId): InfuraProvider {
  return providers[ network ] ||
    (providers[ network ] = new InfuraProvider(network, INFURA_KEY));
}