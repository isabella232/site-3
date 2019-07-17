import React, { useState } from 'react';
import { Checkbox, Form, TextArea } from 'semantic-ui-react';
import { SignMessageRequest } from '../actions/ethereum-provider-actions';
import AddressInput from './AddressInput';


const supportsDecoder = 'TextDecoder' in window;
const textDecoder = supportsDecoder ? new TextDecoder('utf8') : null;

const fromHexString = (hexString: string) =>
  new Uint8Array(hexString.match(/[a-fA-F0-9]{1,2}/g)!.map(byte => parseInt(byte, 16)));


function hexToUtf8(hex: string) {
  if (!supportsDecoder) {
    throw new Error('not supported in this browser');
  }

  return textDecoder!.decode(fromHexString(hex.substring(2)));
}

/**
 * Show information about a sign message request
 * @param request
 * @constructor
 */
export default function SignMessageRequestInfo({ request }: { request: SignMessageRequest; }) {
  const [ showPlainText, setShowPlainText ] = useState<boolean>(supportsDecoder);

  const [ from, message ] = request.params;

  return (
    <Form>
      <Form.Field>
        <label>From address</label>
        <AddressInput fluid readOnly value={from}/>
      </Form.Field>
      <Form.Field>
        <label>Message</label>
        <TextArea readOnly value={showPlainText ? hexToUtf8(message) : message}/>
      </Form.Field>

      {
        supportsDecoder &&
        <Checkbox
          label="Show in plaintext"
          toggle
          checked={showPlainText}
          onChange={() => setShowPlainText(!showPlainText)}/>
      }
    </Form>
  );
}