import { SemanticCOLORS } from 'semantic-ui-react';
import ENSLogo from '../assets/ens-logo.svg';
import EthvaultWalletTempLogo from '../assets/ethvault-wallet-temp-logo.png';
import KickbackLogo from '../assets/kickback-logo.svg';
import MyCryptoLogo from '../assets/mycrypto-logo.svg';

interface SiteLabel {
  color: SemanticCOLORS;
  text: string;
}

const NEW_LABEL: SiteLabel = {
  color: 'green',
  text: 'New'
};

const WIP_LABEL: SiteLabel = {
  color: 'yellow',
  text: 'Work in Progress'
};

export interface Site {
  logo: string;
  name: string;
  labels: SiteLabel[];
  description: string;
  url: string;
}

export const WORKING_SITES_INFO: Readonly<Site[]> = [
  {
    logo: ENSLogo,
    name: 'ENS',
    labels: [ NEW_LABEL, WIP_LABEL ],
    description: 'ENS offers a secure & decentralised way to address resources both on and off the blockchain using simple, human-readable names.',
    url: 'kickback.events'
  },
  {
    logo: EthvaultWalletTempLogo,
    name: 'Ethvault Wallet',
    labels: [ NEW_LABEL ],
    description: 'A simple mobile friendly wallet for sending basic transactions and signing messages.',
    url: 'embedded-wallet.ethvault.dev'
  },
  {
    logo: KickbackLogo,
    name: 'Kickback',
    labels: [ NEW_LABEL, WIP_LABEL ],
    description: 'Event no shows? No problem. Meet Kickback—an Ethereum-based event management service that delivers higher event participation rates by asking registrants to put some skin in the game.',
    url: 'kickback.events'
  },
  {
    logo: MyCryptoLogo,
    name: 'MyCrypto',
    labels: [ WIP_LABEL ],
    description: 'MyCrypto is an open-source, client-side tool for generating ether wallets, handling ERC-20 tokens, and interacting with the blockchain more easily.',
    url: 'mycrypto.com/account'
  },
];