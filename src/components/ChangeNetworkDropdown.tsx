import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { setNetwork } from '../actions/ethereum-provider-actions';
import { GlobalState } from '../reducers';
import { NetworkId, NETWORKS_INFO } from '../util/networks';

export const ChangeNetworkDropdown = connect(
  ({ ethereumProvider: { network } }: GlobalState) => ({
    currentNetwork: network
  }),
  { setNetwork }
)(
  ({
     setNetwork,
     currentNetwork
   }: {
    setNetwork: (network: NetworkId) => void;
    currentNetwork: NetworkId;
  }) => {
    return (
      <Dropdown
        button
        text={NETWORKS_INFO[ currentNetwork ].displayName}
        compact
        className={currentNetwork === 'mainnet' ? 'green' : 'yellow'}>
        <Dropdown.Menu>
          {(Object.keys(NETWORKS_INFO) as NetworkId[]).map(network => (
            <Dropdown.Item
              key={network}
              onClick={() =>
                network === currentNetwork ? null : setNetwork(network)
              }
              active={network === currentNetwork}
            >
              {NETWORKS_INFO[ network ].displayName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
);
