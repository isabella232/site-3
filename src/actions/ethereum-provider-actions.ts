import BigNumber from 'bignumber.js';
import { arrayify } from 'ethers/utils';
import { Wallet } from 'ethers/wallet';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../reducers';
import { getOrCreateJsonRpcClient, NetworkId, NETWORKS_INFO } from '../util/networks';
import { randomId } from '../util/random';
import {
  AddressValidator,
  HexDataValidator,
  JsonRpcRequestValidator,
  SendTransactionParamValidator
} from '../util/validation';
import { showAlert, ShowAlertAction } from './ui-actions';

export interface Message {
  id: string;
  data: any;
}

export interface SendMessagesAction extends Action<'SEND_MESSAGES'> {
  messages: Message[];
}

export interface MessagesSentAction extends Action<'MESSAGES_SENT'> {
  messageIds: string[];
}

export interface ClearQueueAction extends Action<'CLEAR_QUEUE'> {
}

export interface SetNetworkAction extends Action<'SET_NETWORK'> {
  network: NetworkId;
}

// An ethereum address, 0x followed by 20 bytes in hex
export type EthereumAddress = string;
// Arbitrary hexadecimal data
export type Hex = string;
// A hex quantity, 0x followed by any number of hex characters representing a numeric value
export type Quantity = string;

export interface TransactionParamShape {
  from: EthereumAddress;
  to?: EthereumAddress;
  gas?: Quantity;
  value?: Quantity;
  gasPrice?: Quantity;
  data: Hex;
  nonce: Quantity;
}

export interface SignTransactionRequest {
  id: string | number;
  method: 'eth_sendTransaction';
  params: [ TransactionParamShape ];
}

export interface SignMessageRequest {
  id: string | number;
  method: 'eth_sign';
  params: [ EthereumAddress, Hex ];
}

export type ActionableRequest = SignTransactionRequest | SignMessageRequest;

export interface ActionableRequestReceived extends Action<'ACTIONABLE_REQUEST_RECEIVED'> {
  request: ActionableRequest;
}

export interface ActionableRequestHandled extends Action<'ACTIONABLE_REQUEST_HANDLED'> {
  id: string | number;
}

export interface UpdateSendTransactionParameters extends Action<'UPDATE_SEND_TRANSACTION_PARAMETERS'> {
  id: string | number;
  updates: Partial<TransactionParamShape>;
}

export type EthereumProviderActions =
  SendMessagesAction
  | ClearQueueAction
  | MessagesSentAction
  | SetNetworkAction
  | ShowAlertAction
  | ActionableRequestReceived
  | ActionableRequestHandled
  | UpdateSendTransactionParameters;

type EthereumProviderThunkAction<R> = ThunkAction<R,
  GlobalState,
  undefined,
  EthereumProviderActions>;

export interface BaseSendMessageData {
  id: string | number;
}

export interface SuccessResponseSendMessageData extends BaseSendMessageData {
  result: any;
}

export interface ErrorResponseSendMessageData extends BaseSendMessageData {
  error: { code: number; message: string };
}

export interface RequestSendMessageData extends BaseSendMessageData {
  method: string;
  params: any[];
}

type MessageData =
  | SuccessResponseSendMessageData
  | ErrorResponseSendMessageData
  | RequestSendMessageData;

/**
 * Send messages to the child iframe.
 * @param data to send, one item per message
 */
export function sendMessages(data: MessageData[]): SendMessagesAction {
  return {
    type: 'SEND_MESSAGES',
    messages: data.map(messageData => ({
      id: randomId(), // This is a unique identifier for ethvault only, not for communications
      data: { ...messageData, jsonrpc: '2.0' }
    }))
  };
}

/**
 * Send a rejection message to the iframe provider
 * @param id id of the request
 * @param code numeric reason for rejection
 * @param message string reason for rejection
 */
function sendRejectMessage(id: string | number, code: number, message: string): SendMessagesAction {
  return sendMessages([
    { error: { code, message }, id }
  ]);
}

/**
 * Send a result response to an iframe provider request
 * @param id id of the request being responded to
 * @param result result of the request
 */
function sendResultMessage(id: string | number, result: any): SendMessagesAction {
  return sendMessages([
    { result, id }
  ]);
}

/**
 * Used to dismiss a request because it will not be processed.
 * @param id to dismiss
 * @param code number representation of the reason to dismiss
 * @param message textual representation of the reason to dismiss
 */
export function rejectActionableRequest(id: number | string, code: number = 1, message: string = 'The request is not authorized'): EthereumProviderThunkAction<void> {
  return (dispatch) => {
    // Hide the request
    dispatch({
      type: 'ACTIONABLE_REQUEST_HANDLED',
      id
    });

    // Send a rejection message
    dispatch(sendRejectMessage(id, code, message));
  };
}

/**
 * Accept an actionable request. Dismisses the alert and sends a response to the iframe provider.
 * @param id id of the request
 * @param result result of the request
 */
export function acceptActionableRequest(id: number | string, result: any): EthereumProviderThunkAction<void> {
  return (dispatch) => {
    // Hide the request
    dispatch({
      type: 'ACTIONABLE_REQUEST_HANDLED',
      id
    });

    // Send the result to the client
    dispatch(sendResultMessage(id, result));
  };
}

/**
 * Called by the form to update details of the request.
 * @param id id of the request to update
 * @param updates updates that should be made to the request
 */
export function updateSendTransactionParameters(id: number | string, updates: Partial<TransactionParamShape>): EthereumProviderThunkAction<void> {
  return async (dispatch, getState) => {
    const {
      ethereumProvider: { pendingRequests }
    } = getState();

    const request = pendingRequests.find(request => request.id === id);

    if (!request) {
      dispatch(showAlert({
        header: 'Failed to update request',
        message: 'Something went wrong while looking up the request.',
        level: 'error',
      }));
      return;
    }

    if (request.method !== 'eth_sendTransaction') {
      dispatch(showAlert({
        header: 'Failed to update request',
        message: 'Something went wrong while attempting to update the request.',
        level: 'error',
      }));
      return;
    }

    dispatch({
      type: 'UPDATE_SEND_TRANSACTION_PARAMETERS',
      id,
      updates,
    });
  };
}

/**
 * Accept a given requested transaction ID. We do not support modifying the transaction-that is entirely
 * up to the client application.
 * @param id ID of the transaction to accept.
 */
export function acceptRequest(id: number | string): EthereumProviderThunkAction<void> {
  return async (dispatch, getState) => {
    const {
      ethereumProvider: { pendingRequests, network },
      accounts: { unlockedAccount: { info: unlockedAccount } }
    } = getState();

    const request = pendingRequests.find(request => request.id === id);

    if (!request) {
      dispatch(showAlert({
        header: 'Failed to accept request',
        message: 'Something went wrong while looking up the request.',
        level: 'error',
      }));
      return;
    }

    // This should only happen if the user switches accounts somehow or the account becomes locked
    // (e.g. user is logged out)
    if (!unlockedAccount) {
      dispatch(showAlert({
        header: 'Failed to accept request',
        message: 'Your account must be unlocked to sign the request.',
        level: 'error',
      }));
      dispatch(rejectActionableRequest(id));
      return;
    }

    const networkInfo = NETWORKS_INFO[ network ];

    switch (request.method) {
      case 'eth_sendTransaction':
        const [ sendTransactionRequest ] = request.params;

        if (sendTransactionRequest.from.toLowerCase() !== unlockedAccount.address.toLowerCase()) {
          dispatch(showAlert({
            header: 'Failed to sign transaction',
            message: 'The requested account is not unlocked',
            level: 'error'
          }));
          dispatch(rejectActionableRequest(id));
          return;
        }

        let nonce: string;
        try {
          const client = getOrCreateJsonRpcClient(network);
          const transactionCount =
            await client.send('eth_getTransactionCount', [ unlockedAccount.address, 'pending' ]);

          nonce = `0x${new BigNumber(transactionCount).toString(16)}`;
        } catch (error) {
          dispatch(showAlert({
            header: 'Failed to calculate nonce',
            message: `An unexpected error occurred while attempting to get the nonce: ${error.message}`,
            level: 'error',
          }));
          dispatch(rejectActionableRequest(id));
          return;
        }

        let signedRawTransaction: string;
        try {
          const wallet = new Wallet(unlockedAccount.privateKey);

          signedRawTransaction = await wallet.sign({
            chainId: parseInt(networkInfo.chainId, 10),
            nonce,
            to: sendTransactionRequest.to,
            data: sendTransactionRequest.data,
            value: sendTransactionRequest.value,
            gasPrice: sendTransactionRequest.gasPrice,
            gasLimit: sendTransactionRequest.gas,
          });
        } catch (error) {
          dispatch(showAlert({
            header: 'Failed to sign transaction',
            message: `An unexpected error occurred while attempting to sign the transaction: ${error.message}`,
            level: 'error',
          }));
          dispatch(rejectActionableRequest(id));
          return;
        }

        try {
          const client = getOrCreateJsonRpcClient(network);

          const transactionHash = await client.send('eth_sendRawTransaction', [ signedRawTransaction ]);

          const etherscanTxUrl = `${networkInfo.etherscanBaseUrl}/tx/${transactionHash}`;

          dispatch(showAlert({
            header: 'Sent transaction',
            message: `The transaction has been signed and broadcast.`,
            moreInfoUrl: etherscanTxUrl,
            level: 'success'
          }));
          dispatch(acceptActionableRequest(id, transactionHash));
        } catch (error) {
          dispatch(showAlert({
            header: 'Failed to broadcast signed transaction',
            message: `An unexpected error was occurred while attempting to broadcast the signed transaction: ${error.message}`,
            level: 'error',
          }));
          dispatch(rejectActionableRequest(id));
          return;
        }

        break;

      case 'eth_sign':
        const [ address, data ] = request.params;

        if (address.toLowerCase() !== unlockedAccount.address.toLowerCase()) {
          dispatch(showAlert({
            header: 'Failed to sign message',
            message: `The requested signatory address "${address}" is not the unlocked account.`,
            level: 'error',
          }));
          dispatch(rejectActionableRequest(id));
          return;
        }

        try {
          const wallet = new Wallet(unlockedAccount.privateKey);
          const signedData = await wallet.signMessage(arrayify(data));
          dispatch(showAlert({ header: `Signed message`, message: 'The message has been signed.', level: 'success' }));
          dispatch(acceptActionableRequest(id, signedData));
        } catch (error) {
          dispatch(showAlert({
            header: 'Failed to sign message',
            message: `An unexpected error was encountered while attempting to sign the requested data: ${error.message}`,
            level: 'error'
          }));
          dispatch(rejectActionableRequest(id));
          return;
        }

        break;
    }
  };
}


export function accountChanged(account: string | null): SendMessagesAction {
  return sendMessages([
    {
      id: randomId(),
      method: 'accountsChanged',
      // We nest it in an array because the first param is the list of the accounts.
      params: [ account === null ? [] : [ account ] ]
    }
  ]);
}

/**
 * Indicate that messages have been delivered to the iframe.
 * @param messageIds ids of the messages sent
 */
export function messagesSent(messageIds: string[]): MessagesSentAction {
  return {
    type: 'MESSAGES_SENT',
    messageIds
  };
}

/**
 * Set the network to the given value
 * @param network to set it to
 */
export function setNetwork(
  network: NetworkId
): EthereumProviderThunkAction<void> {
  const name = NETWORKS_INFO[ network ].displayName;

  return dispatch => {
    dispatch({
      type: 'SET_NETWORK',
      network
    });

    dispatch(
      sendMessages([
        {
          id: randomId(),
          method: 'networkChanged',
          params: [ NETWORKS_INFO[ network ].networkId ]
        },
        {
          id: randomId(),
          method: 'chainChanged',
          params: [ NETWORKS_INFO[ network ].chainId ]
        }
      ])
    );

    dispatch(
      showAlert({
        header: `Switched to ${name}`,
        message: `The network has been changed to ${name}.`,
        level: 'info'
      })
    );
  };
}

/**
 * Indicate to the store to clear the queue of messages. This should happen,
 * e.g. on src change or reload of iframe content.
 */
export function clearQueue(): ClearQueueAction {
  return {
    type: 'CLEAR_QUEUE'
  };
}

/**
 * A message has been received from the iframe.
 * @param message that was received
 */
export function handleMessage(message: any): EthereumProviderThunkAction<void> {
  message = JSON.parse(JSON.stringify(message));

  return async (dispatch, getState) => {
    console.debug('Message received from iframe', message);

    const messageErrors = JsonRpcRequestValidator.validate(message);

    if (messageErrors.length > 0) {
      console.warn('Dropping message due to failed validation', message, messageErrors);
      return;
    }

    const {
      ethereumProvider: { network },
      accounts: {
        unlockedAccount: { info: unlockedAccountInfo }
      }
    } = getState();

    const networkInfo = NETWORKS_INFO[ network ];

    // Convert personal_sign to eth_sign
    if (message.method === 'personal_sign') {
      if (!message.params || message.params.length !== 2) {
        dispatch(sendRejectMessage(message.id, -32600, 'Request failed validation'));
        console.error('Personal sign message received that did not have the correct number of parameters', message);
        return;
      }

      // Convert it to an eth_sign message.
      message = {
        ...message,
        method: 'eth_sign',
        params: [
          message.params[ 1 ],
          message.params[ 0 ]
        ]
      };
    }

    switch (message.method) {
      case 'enable':
        dispatch(sendMessages([
          {
            id: message.id,
            result: unlockedAccountInfo !== null ? [ unlockedAccountInfo.address ] : []
          }
        ]));
        break;

      case 'eth_accounts':
        // TODO: we shouldn't just expose a user's accounts like this.
        dispatch(
          sendMessages([
            {
              id: message.id,
              result:
                unlockedAccountInfo !== null
                  ? [ unlockedAccountInfo.address ]
                  : []
            }
          ])
        );
        break;

      case 'eth_sendTransaction': {
        if (!message.params || message.params.length !== 1) {
          dispatch(sendRejectMessage(message.id, -32600, 'Request failed validation'));
          console.error('Send transaction message received that did not have the correct number of parameters', message);
          return;
        }

        const transactionParams: TransactionParamShape = message.params[ 0 ];

        const sendTransactionParamErrors = SendTransactionParamValidator.validate(transactionParams);
        if (sendTransactionParamErrors.length > 0) {
          dispatch(sendRejectMessage(message.id, -32600, 'Request failed validation'));
          console.error('Send transaction message received that failed validation', sendTransactionParamErrors);
          return;
        }

        const from = transactionParams.from;
        if (!unlockedAccountInfo || from.toLowerCase() !== unlockedAccountInfo.address.toLowerCase()) {
          dispatch(sendRejectMessage(message.id, -32600, `Invalid address: ${from}`));
          console.error('Send transaction message received that was for an address that is not the unlocked account', from);
          return;
        }

        if (!transactionParams.gasPrice) {
          // TODO: fetch gas price from elsewhere.
          transactionParams.gasPrice = `0x${new BigNumber(Math.pow(10, 9)).toString(16)}`;
        }

        dispatch({
          type: 'ACTIONABLE_REQUEST_RECEIVED',
          request: message,
        });
        break;
      }

      case 'eth_sign': {
        if (!message.params ||
          message.params.length !== 2 ||
          AddressValidator.validate(message.params[ 0 ]).length > 0 ||
          HexDataValidator.validate(message.params[ 1 ]).length > 0) {
          dispatch(sendRejectMessage(message.id, -32600, 'Request failed validation'));
          console.error('Sign message request received that did not have valid parameters', message);
          return;
        }

        const from = message.params[ 0 ];
        if (!unlockedAccountInfo || from.toLowerCase() !== unlockedAccountInfo.address.toLowerCase()) {
          dispatch(sendRejectMessage(message.id, -32600, `Invalid address: ${from}`));
          console.error('Sign message request received that was for an address that is not the unlocked account', message);
          return;
        }

        dispatch({
          type: 'ACTIONABLE_REQUEST_RECEIVED',
          request: message,
        });
        break;
      }

      // By default, delegate to the remote node for the selected network.
      default:
        const response = await fetch(`${networkInfo.nodeUrl}`, {
          method: 'POST',
          body: JSON.stringify(message)
        });

        const result = await response.json();

        dispatch(sendMessages([ result ]));
        break;
    }
  };
}
