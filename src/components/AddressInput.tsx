import * as React from 'react';
import { connect } from 'react-redux';
import { Input, InputProps } from 'semantic-ui-react';
import { GlobalState } from '../reducers';
import { isValidAddress, reverseLookupAddress } from '../util/ens';
import { Account } from '../util/model';
import { NetworkId } from '../util/networks';

interface AddressInputProps extends InputProps {
  network: NetworkId;
  accounts: Account[];
}

interface AddressInputState {
  ensName: string | null;
  loading: Promise<string | null> | null;
  loadCounter: number;
}

export default connect(
  ({ ethereumProvider: { network }, accounts: { accounts } }: GlobalState) => ({
    network,
    accounts
  }),
  {}
)(
  class AddressInput extends React.Component<AddressInputProps, AddressInputState> {
    state = {
      ensName: null,
      loading: null,
      loadCounter: 0,
    };

    loadEnsName = async (): Promise<void> => {
      const { loadCounter } = this.state;
      const { value, network } = this.props;

      const next = loadCounter + 1;
      this.setState({ loadCounter: next });

      const setStateIfLatest = (state: Pick<AddressInputState, 'ensName' | 'loading'>) =>
        next === this.state.loadCounter ? this.setState(state) : null;

      if (!value || !isValidAddress(value)) {
        setStateIfLatest({ ensName: null, loading: null });
        return;
      }

      const promise = reverseLookupAddress(network, value);
      setStateIfLatest({ ensName: null, loading: promise });

      const ensName = await promise;
      setStateIfLatest({ ensName, loading: null });
    };

    componentDidMount(): void {
      if (this.props.value && isValidAddress(this.props.value)) {
        this.loadEnsName();
      }
    }

    componentWillReceiveProps(nextProps: Readonly<AddressInputProps>): void {
      if (nextProps.network !== this.props.network || nextProps.value !== this.props.value) {
        this.loadEnsName();
      }
    }

    render() {
      const { network, accounts, ...inputProps } = this.props;
      const { ensName, loading } = this.state;

      const matchingAccount = isValidAddress(inputProps.value) ?
        accounts.find(account => account.address.toLowerCase() === inputProps.value.toLowerCase()) : null;

      return (
        <Input
          {...inputProps}
          error={inputProps.value && inputProps.value.length > 0 && !isValidAddress(inputProps.value)}
          labelPosition="right"
          loading={Boolean(loading && !matchingAccount)}
          label={
            matchingAccount ? (
              {
                color: 'green',
                pointing: 'left',
                content: matchingAccount.name,
              }
            ) : (
              ensName === null ?
                null : {
                  color: 'blue',
                  pointing: 'left',
                  content: ensName
                }
            )
          }
        />
      );
    }
  }
);