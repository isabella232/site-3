import * as React from 'react';
import { useState } from 'react';
import ReactGA from 'react-ga';
import { Modal, ModalProps } from 'semantic-ui-react';

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
    <Modal {...modalProps} open={open}/>
  );
}