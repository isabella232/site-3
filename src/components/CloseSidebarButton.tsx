import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { closeSidebar } from '../actions/ui-actions';

export const CloseSidebarButton = connect(
  null,
  { closeSidebar }
)(({ closeSidebar }: { closeSidebar: () => void }) => (
  <Button basic compact onClick={closeSidebar}>
    <Icon name="close"/> Close
  </Button>
));
