import React from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';
import { GlobalState } from '../reducers';
import SidebarContent from './SidebarContent';

const StyledSidebar = styled(Sidebar)`
  background-color: white;

  @media (max-width: 768px) {
    width: 100% !important;
  }

  overflow: hidden;
`;

export const AppSidebar = connect(
  ({ ui: { sidebarOpen } }: GlobalState) => ({ sidebarOpen }),
  null
)(({ sidebarOpen }) => (
  <StyledSidebar
    animation="scale down"
    direction="left"
    visible={sidebarOpen}
    width="very wide"
  >
    <SidebarContent/>
  </StyledSidebar>
));
