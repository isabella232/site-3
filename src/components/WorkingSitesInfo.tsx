enum SiteLabel {
  NEW = 'New',
  WORK_IN_PROGRESS = 'WIP',
  NOT_WORKING = 'Not working',
  WORKING = 'Working',
  INTEGRATED = 'Integrated',
  WEB2 = 'Web2'
}

export interface Site {
  name: string;
  labels: SiteLabel[];
  description: string;
  url: string;
}

export const WORKING_SITES_INFO: Readonly<Site[]> = [
  {
    name: 'EthVault Wallet',
    labels: [ SiteLabel.WORKING ],
    description: 'A simple wallet app for sending transactions.',
    url: 'embedded-wallet.ethvault.dev'
  },
  {
    name: 'MyCrypto',
    labels: [ SiteLabel.NOT_WORKING ],
    description: 'Manage your accounts with MyCrypto.',
    url: 'mycrypto.com'
  },
];