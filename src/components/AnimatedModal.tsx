import * as React from 'react';
import { Modal, ModalProps, TransitionablePortal, TransitionProps } from 'semantic-ui-react';

const TRANSITION: TransitionProps = {
  animation: 'scale'
};

export default ({ open, ...modalProps }: ModalProps) => (
  <TransitionablePortal open={open} transition={TRANSITION}>
    <Modal  {...modalProps} open/>
  </TransitionablePortal>
);