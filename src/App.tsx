import React from 'react';
import { Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';
import AlertsComponent from './components/AlertsComponent';
import { AppBackground } from './components/AppBackgroundApp';
import { AppSidebar } from './components/AppSidebar';
import PendingMessagesDialog from './components/PendingMessagesDialog';
import QrCodeModal from './components/QrCodeModal';
import Div100vh from 'react-div-100vh';

const AppContainer = styled(Div100vh)`
  position: fixed;
  
  top: 0;
  left: 0;
  width: 100vw;
`;

export default function AppComponent() {
  return (
    <AppContainer>
      <Sidebar.Pushable>
        <AppSidebar/>
        <AppBackground/>
        <PendingMessagesDialog/>
        <QrCodeModal/>
        <AlertsComponent/>
      </Sidebar.Pushable>
    </AppContainer>
  );
}