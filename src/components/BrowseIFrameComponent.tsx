import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { clearQueue, handleMessage, Message, messagesSent, sendMessages } from '../actions/ethereum-provider-actions';
import { GlobalState } from '../reducers';
import { randomId } from '../util/random';
import { getValidUrl } from '../util/url';
import InvalidURLPage from './InvalidURLPage';

const IFrameContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledIFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;

  border: none;
  outline: none;
`;

interface BrowseIFrameComponentState {
  loaded: boolean;
}

interface BrowseIFrameComponentProps
  extends RouteComponentProps<{ pageUrl: string }> {
  pendingSendMessages: Message[];
  handleMessage: (data: any) => void;
  messagesSent: typeof messagesSent;
  clearQueue: typeof clearQueue;
  sendMessages: typeof sendMessages;
}

export default connect(
  ({ ethereumProvider: { pendingSendMessages } }: GlobalState) => ({
    pendingSendMessages
  }),
  { handleMessage, messagesSent, clearQueue, sendMessages }
)(
  class BrowseIFrameComponent extends React.PureComponent<BrowseIFrameComponentProps,
    BrowseIFrameComponentState> {
    iframeEl: HTMLIFrameElement | null = null;

    state: BrowseIFrameComponentState = {
      loaded: false,
    };

    /**
     *
     */
    private get iframeSrc(): string | null {
      try {
        return getValidUrl(decodeURIComponent(this.props.match.params.pageUrl));
      } catch (error) {
        return null;
      }
    }

    componentWillMount(): void {
      window.addEventListener('message', this.handleWindowMessages);
    }

    componentWillUnmount(): void {
      window.removeEventListener('message', this.handleWindowMessages);
    }

    handleWindowMessages = (e: MessageEvent) => {
      if (e.data && e.data.jsonrpc === '2.0') {
        this.props.handleMessage(e.data);
      }
    };

    componentWillReceiveProps(
      nextProps: Readonly<BrowseIFrameComponentProps>
    ): void {
      if (nextProps.match.params.pageUrl !== this.props.match.params.pageUrl) {
        // A URL change means we clear the communication channels
        nextProps.clearQueue();

        this.setState({ loaded: false });
      }

      if (
        nextProps.pendingSendMessages !== this.props.pendingSendMessages &&
        nextProps.pendingSendMessages.length > 0
      ) {
        const iframeEl = this.iframeEl;
        // Messages are being sent while we don't have an iframe. Simply clear them.
        if (!iframeEl) {
          nextProps.clearQueue();
        } else {
          const sentMessageIds: string[] = [];

          nextProps.pendingSendMessages.forEach(pendingMessage => {
            if (iframeEl && iframeEl.contentWindow) {
              iframeEl.contentWindow.postMessage(pendingMessage.data, '*');

              console.debug('Message posted to iframe', pendingMessage.data);

              sentMessageIds.push(pendingMessage.id);
            }
          });

          nextProps.messagesSent(sentMessageIds);
        }
      }
    }

    updateRef = (iframeEl: HTMLIFrameElement) => {
      this.iframeEl = iframeEl;
    };

    handleLoaded = () => {
      this.setState({ loaded: true });

      const { sendMessages } = this.props;

      sendMessages([
        {
          id: randomId(),
          method: 'connect',
          params: []
        }
      ]);
    };

    render() {
      const src = this.iframeSrc;
      if (src === null) {
        return <InvalidURLPage/>;
      }

      return (
        <IFrameContainer>
          <StyledIFrame
            onLoad={this.handleLoaded}
            ref={this.updateRef}
            src={src}
          />

          <Loader active={!this.state.loaded} size="huge"/>
        </IFrameContainer>
      );
    }
  }
);
