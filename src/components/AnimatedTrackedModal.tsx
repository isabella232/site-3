import * as React from 'react';
import { useState } from 'react';
import ReactGA from 'react-ga';
import { Modal, ModalProps, TransitionablePortal, TransitionProps } from 'semantic-ui-react';

const TRANSITION: TransitionProps = {
  animation: 'scale'
};

export default ({ modalName, open, ...modalProps }: ModalProps & { modalName: string }) => {
  const [ lastOpen, setLastOpen ] = useState<boolean>(Boolean(open));

  if (lastOpen !== Boolean(open)) {
    const opened = !lastOpen && Boolean(open);
    setLastOpen(Boolean(open));
    if (opened) {
      ReactGA.modalview(modalName);
    }
  }

  return (
    <TransitionablePortal open={open} transition={TRANSITION}>
      <Modal {...modalProps} open/>
    </TransitionablePortal>
  );
}