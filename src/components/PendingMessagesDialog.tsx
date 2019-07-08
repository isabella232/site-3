import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Label, Modal } from 'semantic-ui-react';
import {
  acceptRequest,
  ActionableRequest,
  rejectActionableRequest,
  SignMessageRequest,
  SignTransactionRequest
} from '../actions/ethereum-provider-actions';
import { GlobalState } from '../reducers';
import { NetworkId, NETWORKS_INFO } from '../util/networks';
import AnimatedModal from './AnimatedModal';
import SignMessageRequestInfo from './SignMessageRequestInfo';
import SignTransactionRequestInfo from './SignTransactionRequestInfo';

const TYPE_TO_HEADER = {
  'eth_sendTransaction': 'Sign transaction',
  'eth_sign': 'Sign message',
};

interface PendingMessagesDialogProps {
  pendingRequests: ActionableRequest[];
  network: NetworkId;
  dismissRequest: (id: string | number) => void;
  acceptRequest: (id: string | number) => void;
}

export default connect(
  ({ ethereumProvider: { pendingRequests, network } }: GlobalState) => ({ pendingRequests, network }),
  { dismissRequest: rejectActionableRequest, acceptRequest }
)(
  ({ pendingRequests, dismissRequest, acceptRequest, network }: PendingMessagesDialogProps) => {
    const next = pendingRequests.length > 0 ? pendingRequests[ 0 ] : null;
    const [ showing, setShowing ] = useState<SignTransactionRequest | SignMessageRequest | null>(null);

    // We hold on to this in showing so we're always rendering something on the form as the modal disappears
    if (next !== null && next !== showing) {
      setShowing(next);
    }

    const rendering = next === null ? showing : next;

    return (
      <AnimatedModal open={!!next} size="tiny">
        <Label
          attached="top"
          color={NETWORKS_INFO[ network ].color}>{NETWORKS_INFO[ network ].displayName}</Label>

        <Modal.Header>
          {rendering ? TYPE_TO_HEADER[ rendering.method ] : null}
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
      </AnimatedModal>
    );
  });