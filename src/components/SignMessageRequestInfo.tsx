import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { SignMessageRequest } from '../actions/ethereum-provider-actions';
import AddressInput from './AddressInput';

/**
 * Show information about a sign message request
 * @param request
 * @constructor
 */
export default function SignMessageRequestInfo({ request }: { request: SignMessageRequest; }) {
  return (
    <Form>
      <Form.Field>
        <label>From address</label>
        <AddressInput fluid readOnly value={request.params[ 0 ]}/>
      </Form.Field>
      <Form.Field>
        <label>Message</label>
        <TextArea readOnly value={request.params[ 1 ]}/>
      </Form.Field>
    </Form>
  );
}