// The supported network options.
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

interface InfuraClient {
  send(method: string, params: any[]): Promise<any>;
}

const infuraProviders: { [networkName in NetworkId]?: InfuraClient } = {};

class InfuraRpcError extends Error {
  public readonly code: number;
  public readonly reason: string;

  constructor(code: number, reason: string) {
    super(`${code}: ${reason}`);
    this.code = code;
    this.reason = reason;
  }
}

/**
 * Get a provider for the given network
 * @param network network for which to get the provider
 */
export function getOrCreateJsonRpcClient(network: NetworkId): InfuraClient {
  return infuraProviders[ network ] ||
    (infuraProviders[ network ] = {
      async send(method, params) {
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

        const response = await fetch(`${NETWORKS_INFO[ network ].nodeUrl}`, {
          method: 'POST',
          credentials: 'omit',
          mode: 'cors',
          body: JSON.stringify({
            id,
            jsonrpc: '2.0',
            method,
            params
          })
        });

        if (!response.ok) {
          throw new Error('Request failed to send');
        }

        const json = await response.json();

        if (typeof json !== 'object') {
          throw new Error(`Expected object but got ${typeof json} in response`);
        }

        if (json.jsonrpc !== '2.0' || json.id !== id) {
          throw new Error('Invalid response: missing jsonrpc or non-matching id');
        }

        if ('error' in json) {
          const { error: { code, reason } } = json;
          throw new InfuraRpcError(code, reason);
        } else if ('result' in json) {
          return json[ 'result' ];
        }
      }
    });
}