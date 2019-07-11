import { SemanticCOLORS } from 'semantic-ui-react';
import ENSLogo from '../assets/ens-logo.svg';
import EthvaultWalletTempLogo from '../assets/ethvault-wallet-temp-logo.png';
import KickbackLogo from '../assets/kickback-logo.svg';
import MyCryptoLogo from '../assets/mycrypto-logo.svg';
import CryptoKittiesLogo from '../assets/cryptokitties-logo.svg';

interface SiteLabel {
  readonly color: SemanticCOLORS;
  readonly text: string;
}

export enum SiteCategory {
  ADMIN = 'Admin & Developer',
  DEFI = 'Decentralized Finance',
  GAME = 'Game',
  SOCIAL = 'Social',
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
  readonly logo: string;
  readonly name: string;
  readonly labels: SiteLabel[];
  readonly description: string;
  readonly url: string;
  readonly category: SiteCategory;
}

export const WORKING_SITES_INFO: Readonly<Site[]> = [
  {
    logo: ENSLogo,
    name: 'Ethereum Name Service (ENS)',
    labels: [ NEW_LABEL, WIP_LABEL ],
    description: 'ENS offers a secure & decentralised way to address resources both on and off the blockchain using simple, human-readable names.',
    url: 'manager.ens.domains',
    category: SiteCategory.ADMIN,
  },
  {
    logo: EthvaultWalletTempLogo,
    name: 'Ethvault Wallet',
    labels: [ NEW_LABEL ],
    description: 'A simple mobile friendly wallet for sending basic transactions and signing messages.',
    url: 'embedded-wallet.ethvault.dev',
    category: SiteCategory.ADMIN,
  },
  {
    logo: KickbackLogo,
    name: 'Kickback',
    labels: [ NEW_LABEL, WIP_LABEL ],
    description: 'Event no shows? No problem. Meet Kickback—an Ethereum-based event management service that delivers higher event participation rates by asking registrants to put some skin in the game.',
    url: 'kickback.events',
    category: SiteCategory.SOCIAL,
  },
  {
    logo: MyCryptoLogo,
    name: 'MyCrypto',
    labels: [ WIP_LABEL ],
    description: 'MyCrypto is an open-source, client-side tool for generating ether wallets, handling ERC-20 tokens, and interacting with the blockchain more easily.',
    url: 'mycrypto.com/account',
    category: SiteCategory.ADMIN,
  },
  {
    logo: CryptoKittiesLogo,
    name: 'CryptoKitties',
    labels: [ WIP_LABEL ],
    description: 'CryptoKitties is a game centered around breedable, collectible, and oh-so-adorable creatures we call CryptoKitties! Each cat is one-of-a-kind and 100% owned by you; it cannot be replicated, taken away, or destroyed.',
    category: SiteCategory.GAME,
    url: 'cryptokitties.com'
  }
];