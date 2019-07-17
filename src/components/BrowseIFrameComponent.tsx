import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { clearQueue, handleMessage, Message, messagesSent, sendMessages } from '../actions/ethereum-provider-actions';
import { GlobalState } from '../reducers';
import { randomId } from '../util/random';
import { SITES_BY_URL_HOST } from '../util/sites-info';
import { getValidUrl } from '../util/url';
import DocumentTitle from './DocumentTitle';
import { AnalyticsCategory, track } from './GoogleAnalytics';
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
  extends RouteComponentProps {
  pendingSendMessages: Message[];
  handleMessage: (data: any) => void;
  messagesSent: typeof messagesSent;
  clearQueue: typeof clearQueue;
  sendMessages: typeof sendMessages;
}

/**
 * Get the title of the document for a particular src url
 * @param iframeSrc url of the iframe
 */
function getPageTitle(iframeSrc: string | null): string | null {
  if (iframeSrc === null) {
    return null;
  }

  try {
    const url = new URL(iframeSrc);

    const site = SITES_BY_URL_HOST[ url.host ];

    return site ? site.name : url.host;
  } catch (error) {
    return null;
  }
}

/**
 * Given a route hash, return the URL that should be rendered in the iframe or null if it's invalid
 * @param hash hash of the route
 */
function getIFrameSrcFromHash(hash: string): string | null {
  try {
    if (hash.length < 2) {
      return null;
    }
    return getValidUrl(hash.substring(1));
  } catch (error) {
    return null;
  }
}

/**
 * Track when the hash changes to a valid URL. We do this so we can know which sites are getting usage and require
 * more support.
 *
 * @param hash hash of the route
 */
function trackHashChange(hash: string) {
  const src = getIFrameSrcFromHash(hash);

  if (src !== null) {
    track(AnalyticsCategory.UI, 'VISIT_EMBEDDED_SITE', src);
  }
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
     * Return the src of the iframe to render
     */
    private getIFrameSrc(): string | null {
      try {
        const hash = this.props.location.hash;
        return getIFrameSrcFromHash(hash);
      } catch (error) {
        return null;
      }
    }

    componentWillMount(): void {
      window.addEventListener('message', this.handleWindowMessages);
    }

    componentDidMount(): void {
      trackHashChange(this.props.location.hash);
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
      if (nextProps.location.hash !== this.props.location.hash) {
        // A URL change means we clear the communication channels
        nextProps.clearQueue();

        this.setState({ loaded: false });

        trackHashChange(nextProps.location.hash);
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
      const src = this.getIFrameSrc();

      if (src === null) {
        return <InvalidURLPage/>;
      }

      return (
        <IFrameContainer>
          <StyledIFrame
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={this.handleLoaded}
            ref={this.updateRef}
            src={src}
          />

          <Loader active={!this.state.loaded} size="huge"/>
          <DocumentTitle title={getPageTitle(src)}/>
        </IFrameContainer>
      );
    }
  }
);
