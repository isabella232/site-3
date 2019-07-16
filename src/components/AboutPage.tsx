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

      <Header as="h3">
        Ethvault is a free and <ExternalLink href="https://github.com/ethvault">open
        source</ExternalLink> Ethereum wallet and decentralized app (aka DAPP) browser paired with a key storage
        service.
      </Header>

      <p>
        Your keys are stored securely in your Vault and you can use your Ethereum accounts from anywhere.
      </p>

      <Divider/>

      <Header as="h2">Frequently Asked Questions</Header>
      <Header as="h3">How does Ethvault work?</Header>
      <p>
        Ethvault runs DAPPs in a sandbox called an iframe and manages your keys for you. Ethvault notifies you whenever
        the DAPP requires your signature on any transactions or messages. The keys are stored on the service
        so you can access the keys and DAPPs from anywhere. Strict access control and your client side password
        prevent anyone from gaining access to your wallet.
      </p>
      <Header as="h3">Is Ethvault safe to use?</Header>
      <p>
        Ethvault uses strong client side encryption combined with server side encryption in a highly protected AWS
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
        JSON Keystore format</ExternalLink> and import them into any compatible wallet.
      </p>
      <Header as="h3">Can I delete my keys?</Header>
      <p>
        You are free to delete your keys and they will be purged from the service within 1 month. Please contact
        us if you would like us to remove your keys earlier via <a
        href="mailto:moody.salem@gmail.com">moody.salem@gmail.com</a>
        or if you delete your keys by accident.
      </p>
      <Header as="h3">Is there any limit on how many accounts I can have?</Header>
      <p>
        You are free to create as many accounts as you like.
      </p>
      <Header as="h3">How can I integrate?</Header>
      <p>
        See the <ExternalLink
        href="https://github.com/ethvault/iframe-provider">ethvault/iframe-provider</ExternalLink> repository for more
        information.
      </p>

    </StyledContainer>
  );
}