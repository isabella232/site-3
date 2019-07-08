import * as React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { closeSidebar } from '../actions/ui-actions';
import { AnalyticsCategory } from './GoogleAnalytics';
import TrackedButton from './TrackedButton';

export const CloseSidebarButton = connect(
  null,
  { closeSidebar }
)(({ closeSidebar }: { closeSidebar: () => void }) => (
  <TrackedButton basic compact onClick={closeSidebar} category={AnalyticsCategory.UI} action={'CLOSE_VAULT'}>
    <Icon name="close"/> Close
  </TrackedButton>
));
