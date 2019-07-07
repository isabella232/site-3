import { SemanticCOLORS } from 'semantic-ui-react';

interface SiteLabel {
  color: SemanticCOLORS;
  text: 'WIP' | 'Working' | 'New';
}

const NEW_LABEL: SiteLabel = {
  color: 'green',
  text: 'New'
};

const WORKING_LABEL: SiteLabel = {
  color: 'violet',
  text: 'Working'
};

const WIP_LABEL: SiteLabel = {
  color: 'yellow',
  text: 'WIP'
};

export interface Site {
  name: string;
  labels: SiteLabel[];
  description: string;
  url: string;
}

export const WORKING_SITES_INFO: Readonly<Site[]> = [
  {
    name: 'MyCrypto',
    labels: [ WIP_LABEL ],
    description: 'View your wallet, send ether and tokens, sign messages and manage your accounts.',
    url: 'mycrypto.com/account'
  },
  {
    name: 'Ethvault Wallet',
    labels: [ NEW_LABEL, WORKING_LABEL ],
    description: 'A simple demo wallet app for sending transactions and signing messages.',
    url: 'embedded-wallet.ethvault.dev'
  },
];