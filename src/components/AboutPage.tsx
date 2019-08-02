import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Divider, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import DocumentTitle from './DocumentTitle';
import ExternalLink from './ExternalLink';
import { GetStartedChecklist } from './GetStartedChecklist';
import HeaderFont from './HeaderFont';

const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

export default function AboutPage(props: RouteComponentProps) {
  return (
    <StyledContainer>
      <DocumentTitle title="About"/>
      <Header as="h1"><HeaderFont>About Ethvault</HeaderFont></Header>

      <Header as="h2">
        Ethvault is a free and <ExternalLink href="https://github.com/ethvault">open
        source</ExternalLink> Ethereum wallet and decentralized application browser built for the browser.
      </Header>

      <Header as="h3">
        What does that mean?
      </Header>

      <p>
        Ethvault enables you to use your Ethereum accounts with your favorite dApps from any device.
        You can send uncensorable peeps via Peepeth, grow your money with Compound, RSVP to events with Kickback,
        or find work with Ethlance-directly in the browser from any device, the same way you would use any website.
      </p>

      <Header as="h3">
        How can I use it?
      </Header>

      <p>Follow these steps to get started!</p>

      <GetStartedChecklist/>

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
        href="mailto:support@myethvault.com">support@myethvault.com</a>. We will respond to any support requests within
        1
        business day.
      </p>

      <Header as="h3">How does Ethvault work?</Header>
      <p>
        Ethvault runs dApps in a sandbox called an iframe and stores your encrypted keys for you.
        The dApp can request your signature (i.e. authorization) on transactions and messages.
        Because the encrypted keys are stored with the Ethvault service, you can use the same Ethereum account
        from any device.
      </p>

      <Header as="h3">Is Ethvault safe to use?</Header>
      <p>
        Ethvault uses client side encryption combined with server side encryption in a highly protected AWS
        account to keep your keys safe. All the code is open source and available for audit, including the back end
        key service. <strong>Still, it is recommended to limit the value of the assets stored in any third party wallet
        including Ethvault.</strong> Please limit the value of the assets stored in Ethvault accounts to less than
        $1,500 USD.
      </p>

      <Header as="h3">How is Ethvault different from other wallets?</Header>
      <p>
        Ethvault keeps your encrypted keys stored on the server. That means you can log in from anywhere with your
        username and password and interact with Ethereum dApps, and you don't have to worry about losing a seed phrase
        or hardware wallet.
      </p>

      <Header as="h3">Can I use my keys in another wallet?</Header>
      <p>
        You can export your keys in the standard <ExternalLink
        href="https://theethereum.wiki/w/index.php/Accounts,_Addresses,_Public_And_Private_Keys,_And_Tokens#UTC_JSON_Keystore_File">UTC
        JSON Keystore format</ExternalLink> and import them into any compatible wallet. You should always keep a backup
        of your keys on another storage provider. However be aware that exporting your keys introduces additional risk,
        so remember to choose a very strong password to limit your risk.
      </p>

      <Header as="h3">What happens when I delete my keys?</Header>
      <p>
        For your convenience, the encrypted key data is purged 1 month after you mark it for deletion.
        Please contact us if you would like your encrypted key data purged earlier, or if you deleted a key by accident,
        via e-mail at <a href="mailto:support@myethvault.com">support@myethvault.com</a>
      </p>

      <Header as="h3">Is there any limit on how many accounts I can have?</Header>
      <p>
        No.
      </p>

      <Header as="h3">How many accounts should I create?</Header>
      <p>
        You can think of your Ethereum accounts like bank accounts. Most people want two accounts-an account for your
        daily interaction with the Ethereum network (i.e. checking account), and an account for storing most of your
        assets (i.e. savings.)
      </p>

      <Header as="h3">What is my account alias?</Header>
      <p>
        The account alias is an <ExternalLink href="https://ens.domains/">Ethereum Name Service</ExternalLink> subdomain
        that is assigned to the address for your account. You are the owner of the ENS subdomain and can assign
        additional records or even change the resolver. The alias must be globally unique. You can inspect the ENS
        myethvault.com domain <ExternalLink
        href="https://manager.ens.domains/name/myethvault.com/subdomains">here</ExternalLink>.
      </p>

      <Header as="h3">How can I integrate with Ethvault?</Header>
      <p>
        Follow the <ExternalLink href="https://github.com/ethvault/integration-guide">integration
        guide</ExternalLink> to integrate with Ethvault.
      </p>
    </StyledContainer>
  );
}