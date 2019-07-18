import BigNumber from 'bignumber.js';
import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, TextArea } from 'semantic-ui-react';
import {
  SignTransactionRequest,
  TransactionParamShape,
  updateSendTransactionParameters
} from '../actions/ethereum-provider-actions';
import AddressInput from './AddressInput';

interface SignTransactionRequestInfoProps {
  request: SignTransactionRequest;
  updateSendTransactionParameters: (id: string | number, updates: Partial<TransactionParamShape>) => void;
}

const GWEI_MULTIPLIER = new BigNumber(Math.pow(10, 9));

const ETH_MULTIPLIER = GWEI_MULTIPLIER.multipliedBy(Math.pow(10, 9));

/**
 * Renders the sign transaction request from the client application
 * @param from
 * @param data
 * @param gas
 * @param to
 * @param value
 * @param gasPrice
 * @constructor
 */
export default connect(
  null,
  { updateSendTransactionParameters }
)(
  function SignTransactionRequestInfo({
                                        request: { id, params: [ { from, data, gas, to, value, gasPrice } ] },
                                        updateSendTransactionParameters
                                      }: SignTransactionRequestInfoProps) {
    return (
      <Form>
        <Form.Field>
          <label>Send amount</label>
          <Input fluid readOnly value={`${new BigNumber(value || '0x0').dividedBy(ETH_MULTIPLIER).toString()} ETH`}/>
        </Form.Field>
        <Form.Field>
          <label>From address</label>
          <AddressInput fluid readOnly value={from}/>
        </Form.Field>
        {
          to ? (
            <Form.Field>
              <label>To address</label>
              <AddressInput fluid readOnly value={to}/>
            </Form.Field>
          ) : null
        }
        {
          gas && (new BigNumber(gas).gt(0)) ? (
            <Form.Field>
              <label>Gas</label>
              <Input fluid readOnly type="number" value={new BigNumber(gas).toString()}/>
            </Form.Field>
          ) : null
        }
        <Form.Field>
          <label>Gas Price</label>
          <Input
            fluid
            type="number"
            min={0}
            step={1}
            max={200}
            pattern="^\d+(\.\d+)?$"
            onChange={({ target: { value: newGasPrice } }) => {
              updateSendTransactionParameters(id, { gasPrice: `0x${new BigNumber(newGasPrice).multipliedBy(GWEI_MULTIPLIER).toString(16)}` });
            }}
            value={new BigNumber(gasPrice || '0x').dividedBy(GWEI_MULTIPLIER).toString()}
            labelPosition="right"
            label={{
              content: 'GWEI'
            }}
          />
        </Form.Field>
        {
          data && data !== '0x' ? (
            <Form.Field>
              <label>Data</label>
              <TextArea readOnly value={data}/>
            </Form.Field>
          ) : null
        }
      </Form>
    );
  }
);