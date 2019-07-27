import * as React from 'react';
import { useState } from 'react';
import { QRCode } from 'react-qr-svg';
import { connect } from 'react-redux';
import { Button, Modal } from 'semantic-ui-react';
import { dismissShowQrCode } from '../actions/accounts-actions';
import { GlobalState } from '../reducers';
import { Account } from '../util/model';
import TrackedModal from './TrackedModal';

interface QrCodeModalProps {
  accounts: Account[];
  showingQrCodeAccountId: string | null;
  dismissShowQrCode: () => void;
}

export default connect(
  ({ accounts: { showingQrCodeAccountId, accounts } }: GlobalState) => ({ showingQrCodeAccountId, accounts }),
  { dismissShowQrCode }
)(
  ({ accounts, showingQrCodeAccountId, dismissShowQrCode }: QrCodeModalProps) => {
    const account = showingQrCodeAccountId ?
      accounts.find(account => account.id === showingQrCodeAccountId) :
      null;

    const [ lastAccount, setLastAccount ] = useState<Account | null>(null);

    if (lastAccount !== account && !!account) {
      setLastAccount(account);
    }

    return (
      <TrackedModal open={Boolean(account)} onClose={dismissShowQrCode} size="mini" modalName="SHOW_QR_CODE">
        <Modal.Header>{lastAccount && lastAccount.name}</Modal.Header>
        <Modal.Content>
          {
            lastAccount &&
            <QRCode
              value={lastAccount.address}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
              style={{ width: '100%' }}
            />
          }
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => dismissShowQrCode()}>
            Done
          </Button>
        </Modal.Actions>
      </TrackedModal>
    );
  }
);