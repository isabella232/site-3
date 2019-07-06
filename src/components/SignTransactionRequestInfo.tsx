import BigNumber from 'bignumber.js';
import { formatEther, formatUnits } from 'ethers/utils';
import React from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import { SignTransactionRequest } from '../actions/ethereum-provider-actions';
import AddressInput from './AddressInput';

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
export default function SignTransactionRequestInfo({ request: { params: [ { from, data, gas, to, value, gasPrice } ] } }: { request: SignTransactionRequest }) {
  return (
    <Form>
      <Form.Field>
        <label>Send amount</label>
        <Input fluid readOnly value={`${formatEther(value || '0x0')} ETH`}/>
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
      {
        gasPrice && (new BigNumber(gasPrice).gt(0)) ? (
          <Form.Field>
            <label>Gas Price</label>
            <Input
              fluid
              readOnly
              type="number"
              value={formatUnits(gasPrice, 'gwei')}
              labelPosition="right"
              label={{
                content: 'GWEI'
              }}
            />
          </Form.Field>
        ) : null
      }
      {
        data && data.length > 2 ? (
          <Form.Field>
            <label>Data</label>
            <TextArea readOnly value={data}/>
          </Form.Field>
        ) : null
      }
    </Form>
  );
}