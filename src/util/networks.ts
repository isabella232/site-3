// The supported network options.
import { SemanticCOLORS } from 'semantic-ui-react';
import { INFURA_KEY } from './env';

export type NetworkId = 'mainnet' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

// Information about an individual network.
export interface NetworkInfo {
  displayName: string;
  chainId: string;
  networkId: string;
  nodeUrl: string;
  ensAddress: string | null;
  etherscanBaseUrl: string;
  color: SemanticCOLORS;
}

// The network information by identifier
export type NetworksInfo = { [networkName in NetworkId]: NetworkInfo };

export const NETWORKS_INFO: NetworksInfo = {
  mainnet: {
    displayName: 'Mainnet',
    chainId: '1',
    networkId: '1',
    ensAddress: '0x314159265dD8dbb310642f98f50C066173C1259b',
    nodeUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    etherscanBaseUrl: `https://etherscan.io`,
    color: 'green',
  },
  ropsten: {
    displayName: 'Ropsten',
    chainId: '3',
    networkId: '3',
    ensAddress: null,
    nodeUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    etherscanBaseUrl: `https://ropsten.etherscan.io`,
    color: 'yellow'
  },
  rinkeby: {
    displayName: 'Rinkeby',
    chainId: '4',
    networkId: '4',
    ensAddress: null,
    nodeUrl: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    etherscanBaseUrl: `https://rinkeby.etherscan.io`,
    color: 'orange'
  },
  kovan: {
    displayName: 'Kovan',
    chainId: '42',
    networkId: '42',
    ensAddress: null,
    nodeUrl: `https://kovan.infura.io/v3/${INFURA_KEY}`,
    etherscanBaseUrl: `https://kovan.etherscan.io`,
    color: 'purple'
  },
  goerli: {
    displayName: 'Goerli',
    chainId: '5',
    networkId: '5',
    ensAddress: null,
    nodeUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    etherscanBaseUrl: `https://goerli.etherscan.io`,
    color: 'pink'
  }
};

interface InfuraClient {
  send(method: string, params: any[]): Promise<any>;
}

const infuraProviders: { [networkName in NetworkId]?: InfuraClient } = {};

class InfuraRpcError extends Error {
  public readonly code: number;
  public readonly message: string;

  constructor(code: number, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.message = message;
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
          const { error: { code, message } } = json;
          throw new InfuraRpcError(code, message);
        } else if ('result' in json) {
          return json[ 'result' ];
        }
      }
    });
}