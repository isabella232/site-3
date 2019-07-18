import { Reducer } from 'redux';
import { LoggedOutAction } from '../actions/auth-actions';
import { ActionableRequest, EthereumProviderActions, Message } from '../actions/ethereum-provider-actions';
import { NetworkId } from '../util/networks';

export interface EthereumProviderState {
  pendingSendMessages: Message[];
  network: NetworkId;
  pendingRequests: ActionableRequest[];
}

const initialState: EthereumProviderState = {
  pendingSendMessages: [],
  pendingRequests: [],
  network: 'mainnet'
};

export const ethereumProviderReducer: Reducer<EthereumProviderState,
  EthereumProviderActions | LoggedOutAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGGED_OUT':
      return {
        ...state,
        pendingSendMessages: []
      };

    case 'CLEAR_QUEUE':
      return {
        ...state,
        pendingSendMessages: [],
        pendingRequests: [],
      };

    case 'SEND_MESSAGES':
      return {
        ...state,
        pendingSendMessages: state.pendingSendMessages.concat(action.messages)
      };

    case 'MESSAGES_SENT':
      const ids = new Set(action.messageIds);

      return {
        ...state,
        pendingSendMessages: state.pendingSendMessages.filter(
          ({ id }) => !ids.has(id)
        )
      };

    case 'ACTIONABLE_REQUEST_RECEIVED':
      return {
        ...state,
        pendingRequests: [
          ...state.pendingRequests,
          action.request
        ]
      };

    case 'UPDATE_SEND_TRANSACTION_PARAMETERS':
      return {
        ...state,
        pendingRequests: state.pendingRequests.map(
          request => {
            if (request.id === action.id && request.method === 'eth_sendTransaction') {
              return {
                ...request,
                params: [
                  {
                    ...request.params[ 0 ],
                    ...action.updates
                  }
                ]
              };
            }

            return request;
          }
        ),
      };

    case 'ACTIONABLE_REQUEST_HANDLED':
      return {
        ...state,
        pendingRequests: state.pendingRequests.filter(request => request.id !== action.id)
      };

    case 'SET_NETWORK':
      return {
        ...state,
        network: action.network,
        pendingSendMessages: []
      };
  }

  return state;
};
