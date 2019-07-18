import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { setNetwork } from '../actions/ethereum-provider-actions';
import { GlobalState } from '../reducers';
import { NetworkId, NETWORKS_INFO } from '../util/networks';
import { AnalyticsCategory, track } from './GoogleAnalytics';

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
        className={NETWORKS_INFO[ currentNetwork ].color}>
        <Dropdown.Menu>
          <Dropdown.Header>Change network</Dropdown.Header>
          <Dropdown.Divider/>
          {(Object.keys(NETWORKS_INFO) as NetworkId[]).map(network => (
            <Dropdown.Item
              key={network}
              onClick={() => {
                if (network !== currentNetwork) {
                  setNetwork(network);
                  track(AnalyticsCategory.ETHEREUM, 'CHANGE_NETWORK', network);
                }
              }}
              active={network === currentNetwork}>
              {NETWORKS_INFO[ network ].displayName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
);
