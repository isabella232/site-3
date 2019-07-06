import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Header, Icon, Modal, TransitionablePortal } from 'semantic-ui-react';
import {
  acceptRequest,
  ActionableRequest,
  rejectActionableRequest,
  SignMessageRequest,
  SignTransactionRequest
} from '../actions/ethereum-provider-actions';
import { GlobalState } from '../reducers';
import SignMessageRequestInfo from './SignMessageRequestInfo';
import SignTransactionRequestInfo from './SignTransactionRequestInfo';

const TYPE_TO_HEADER = {
  'eth_sendTransaction': 'Sign transaction',
  'eth_sign': 'Sign message',
};

interface PendingMessagesDialogProps {
  pendingRequests: ActionableRequest[];
  dismissRequest: (id: string | number) => void;
  acceptRequest: (id: string | number) => void;
}

export default connect(
  ({ ethereumProvider: { pendingRequests } }: GlobalState) => ({ pendingRequests }),
  { dismissRequest: rejectActionableRequest, acceptRequest }
)(
  ({ pendingRequests, dismissRequest, acceptRequest }: PendingMessagesDialogProps) => {
    const next = pendingRequests.length > 0 ? pendingRequests[ 0 ] : null;
    const [ showing, setShowing ] = useState<SignTransactionRequest | SignMessageRequest | null>(null);

    // We hold on to this in showing so we're always rendering something on the form as the modal disappears
    if (next !== null && next !== showing) {
      setShowing(next);
    }

    const rendering = next === null ? showing : next;

    return (
      <TransitionablePortal open={next !== null} transition={{ animation: 'scale' }}>
        <Modal open size="tiny">
          <Modal.Header>
            <Header>
              <Header.Content>{rendering ? TYPE_TO_HEADER[ rendering.method ] : null}</Header.Content>
              {
                pendingRequests.length < 2 ? null :
                  <Header.Subheader>{pendingRequests.length - 1} other request(s)</Header.Subheader>
              }
            </Header>
          </Modal.Header>
          <Modal.Content>
            {
              rendering ? (
                rendering.method === 'eth_sign' ?
                  <SignMessageRequestInfo request={rendering}/> :
                  <SignTransactionRequestInfo request={rendering}/>
              ) : null
            }
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" type="button" onClick={() => next && dismissRequest(next.id)}>
              <Icon name="cancel"/> Reject
            </Button>
            <Button primary type="button" onClick={() => next && acceptRequest(next.id)}>
              <Icon name="send"/> Sign
            </Button>
          </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    );
  });