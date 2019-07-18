import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Divider, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import DocumentTitle from './DocumentTitle';
import ExternalLink from './ExternalLink';

const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

export default function AboutPage(props: RouteComponentProps) {
  return (
    <StyledContainer>
      <DocumentTitle title="About"/>
      <Header as="h1">About Ethvault</Header>

      <Header as="h2">
        Ethvault is a free and <ExternalLink href="https://github.com/ethvault">open
        source</ExternalLink> Ethereum wallet and decentralized application browser paired with a key backup
        service.
      </Header>

      <Divider/>

      <Header as="h2" id="frequently-asked-questions">Frequently Asked Questions</Header>
      <Header as="h3">Do you have access to my private key?</Header>
      <p>
        Your private key is encrypted on the client. Choose a strong password and your private keys will never be
        exposed to Ethvault developers nor those who may successfully attack the Ethvault database. For accounts that
        will store assets of greater value, choose a very strong password!
      </p>

      <Header as="h3">How can I reach Ethvault?</Header>
      <p>
        You can reach the developers at Ethvault directly via e-mail at <a
        href="mailto:moody@ethvault.xyz">moody@ethvault.xyz</a>. We will respond to any support requests within 1
        business day.
      </p>

      <Header as="h3">How does Ethvault work?</Header>
      <p>
        Ethvault runs DAPPs in a sandbox called an iframe and stores your encrypted keys for you.
        The DAPP can request your signature (i.e. authorization) on transactions and messages.
        Because the encrypted keys are stored with the Ethvault service, you can use the same Ethereum account
        from any device.
      </p>

      <Header as="h3">Is Ethvault safe to use?</Header>
      <p>
        Ethvault uses client side encryption combined with server side encryption in a highly protected AWS
        account to keep your keys safe. All the code is open source and available for audit, including the back end
        key service.
      </p>

      <Header as="h3">How is Ethvault different from other wallets?</Header>
      <p>
        Ethvault keeps your encrypted keys stored on the server. That means you can log in from anywhere with your
        username and password and interact with Ethereum DAPPs, and you don't have to worry about losing a seed phrase
        or hardware wallet.
      </p>

      <Header as="h3">Can I use my keys in another wallet?</Header>
      <p>
        You can export your keys in the <ExternalLink
        href="https://theethereum.wiki/w/index.php/Accounts,_Addresses,_Public_And_Private_Keys,_And_Tokens#UTC_JSON_Keystore_File">UTC
        JSON Keystore format</ExternalLink> and import them into any compatible wallet. You should always keep a backup
        of your keys on another storage provider.
      </p>

      <Header as="h3">What happens when I delete my keys?</Header>
      <p>
        For your convenience, the encrypted key data is purged 1 month after you mark it for deletion.
        Please contact us if you would like your encrypted key data purged earlier, or if you deleted a key by accident,
        via e-mail at <a href="mailto:moody@ethvault.xyz">moody@ethvault.xyz</a>
      </p>

      <Header as="h3">Is there any limit on how many accounts I can have?</Header>
      <p>
        You are free to create as many accounts as you like.
      </p>

      <Header as="h3">How can I integrate with Ethvault?</Header>
      <p>
        In summary, you utilize a Web3 provider similar to MetaMask that allows your site to communicate with Ethvault
        and other iframe based wallets. See the <ExternalLink
        href="https://github.com/ethvault/iframe-provider">ethvault/iframe-provider</ExternalLink> repository for more
        information.
      </p>
    </StyledContainer>
  );
}