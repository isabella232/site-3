import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Message, SemanticICONS, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
import { dismissAlert } from '../actions/ui-actions';
import { GlobalState } from '../reducers';
import { Alert } from '../reducers/ui-reducer';
import ExternalLink from './ExternalLink';

const AlertParentContainer = styled.div`
  pointer-events: none;
  touch-action: none;
  user-select: none;

  position: fixed;
  padding: 20px;
  top: 0;
  right: 0;
  
  max-width: 768px;

  max-height: 100vh;
  overflow: hidden;

  z-index: 1001;

  @media (max-width: 768px) {
    padding: 12px;
    bottom: 0;
    top: initial;
    right: initial;
    left: 0;
    width: 100%;
  }
`;

const AlertChildContainer = styled.div`
  pointer-events: auto;
  margin-bottom: 0.6rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    margin-top: 0.6rem;
  }
`;

interface AlertsComponentProps {
  alerts: Alert[];
  dismissAlert: typeof dismissAlert;
}

const LEVEL_ICONS: {
  [level in 'success' | 'warning' | 'info' | 'error']: SemanticICONS;
} = {
  success: 'check',
  warning: 'warning',
  error: 'warning',
  info: 'info'
};

/**
 * Return true if the link is internal to the site
 * @param moreInfoUrl the url
 */
function isInternalLink(moreInfoUrl: string): boolean {
  return moreInfoUrl.startsWith('/') && !moreInfoUrl.startsWith('//');
}

export default connect(
  ({ ui: { alerts } }: GlobalState) => ({ alerts }),
  { dismissAlert }
)(
  class AlertsComponent extends React.Component<AlertsComponentProps> {
    render() {
      const { alerts, dismissAlert } = this.props;

      return (
        <Transition.Group
          as={AlertParentContainer}
          animation="vertical flip"
          duration={200}>
          {alerts.map(({ id, header, level, message, moreInfoUrl }) => (
            <AlertChildContainer key={id}>
              <Message
                onDismiss={() => dismissAlert(id)}
                success={level === 'success'}
                warning={level === 'warning'}
                info={level === 'info'}
                error={level === 'error'}
                icon>
                <Icon name={LEVEL_ICONS[ level ]}/>
                <Message.Content>
                  <Message.Header>{header}</Message.Header>
                  <div>{message}</div>
                  {
                    moreInfoUrl ? (
                      isInternalLink(moreInfoUrl) ?
                        <Link to={moreInfoUrl}>More info <Icon name="external"/></Link> :
                        <ExternalLink href={moreInfoUrl}>More info <Icon name="external"/></ExternalLink>
                    ) : null
                  }
                </Message.Content>
              </Message>
            </AlertChildContainer>
          ))}
        </Transition.Group>
      );
    }
  }
);
