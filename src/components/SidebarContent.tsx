import * as React from 'react';
import { connect } from 'react-redux';
import { Divider, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import { loadAccounts } from '../actions/accounts-actions';
import { GlobalState } from '../reducers';
import { VERSION } from '../util/env';
import AccountList from './AccountList';
import { ChangeNetworkDropdown } from './ChangeNetworkDropdown';
import { CloseSidebarButton } from './CloseSidebarButton';
import { CreateAccountDialog } from './CreateAccountDialog';
import { LoggedOutPlaceholder } from './Placeholders';
import UnlockAccountPasswordDialog from './UnlockAccountPasswordDialog';

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

const StyledHeader = styled.header`
  position: relative;
  flex-shrink: 0;

  text-align: center;
  padding: 0.6rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledContent = styled.section`
  flex-grow: 1;
  flex-shrink: 1;

  overflow: hidden;
  position: relative;
`;

const StyledContentInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 0.6rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

export interface SidebarContentProps {
  loadAccounts: () => void;
  isLoggedIn: boolean;
}

export default connect(
  ({ auth }: GlobalState) => ({ isLoggedIn: auth.isLoggedIn }),
  { loadAccounts }
)(
  class SidebarContent extends React.Component<SidebarContentProps> {
    componentDidMount(): void {
      if (this.props.isLoggedIn) {
        this.props.loadAccounts();
      }
    }

    componentWillReceiveProps(nextProps: Readonly<SidebarContentProps>): void {
      if (nextProps.isLoggedIn && !this.props.isLoggedIn) {
        this.props.loadAccounts();
      }
    }

    render() {
      return (
        <StyledContainer>
          <StyledHeader>
            <ChangeNetworkDropdown/>

            <Header style={{ margin: 0 }} as="h1" title={VERSION}>
              My Vault
            </Header>

            <CloseSidebarButton/>
          </StyledHeader>

          <Divider fitted/>

          <StyledContent>
            <StyledContentInner>
              {this.props.isLoggedIn ? (
                <AccountList/>
              ) : (
                <LoggedOutPlaceholder/>
              )}
            </StyledContentInner>
          </StyledContent>

          <CreateAccountDialog/>

          <UnlockAccountPasswordDialog/>
        </StyledContainer>
      );
    }
  }
);
