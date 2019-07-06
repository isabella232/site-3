import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { copyAddressToClipboard, showQrCode } from '../actions/accounts-actions';
import { GlobalState } from '../reducers';
import { Account } from '../util/model';
import { NetworkId, NETWORKS_INFO } from '../util/networks';

const FlexParent = styled.div`
  display: flex;
  align-items: center;
`;

const FlexChildGrow = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const FlexChildFixed = styled.div`
  flex-shrink: 0;
`;

interface AccountAddressProps {
  account: Account | null;
  network: NetworkId;
  showQrCode: (id: string) => void;
  copyAddressToClipboard: (id: string) => void;
}

export default connect(
  ({ accounts: { accounts }, ethereumProvider: { network } }: GlobalState, { accountId }: { accountId: string; }) => ({
    account: accounts.find(account => account.id === accountId) || null,
    network
  }),
  { showQrCode, copyAddressToClipboard }
)(
  ({ account, showQrCode, copyAddressToClipboard, network }: AccountAddressProps) => (
    account ? (
      <FlexParent>
        <FlexChildGrow>
          {account.address}
        </FlexChildGrow>
        <FlexChildFixed>
          <Button
            onClick={() => showQrCode(account.id)}
            icon compact basic>
            <Icon name="qrcode"/>
          </Button>
        </FlexChildFixed>
        <FlexChildFixed>
          <Button
            title="Copy address to clipboard"
            onClick={() => copyAddressToClipboard(account.id)}
            icon compact basic>
            <Icon name="clipboard"/>
          </Button>
        </FlexChildFixed>
        <FlexChildFixed>
          <Button
            icon compact basic as="a" target="_blank" rel="noopener noreferrer"
            title="View on Etherscan"
            href={`${NETWORKS_INFO[ network ].etherscanBaseUrl}/address/${account.address}`}>
            <Icon name="external"/>
          </Button>
        </FlexChildFixed>
      </FlexParent>
    ) : null
  )
);