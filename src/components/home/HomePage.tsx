import React from 'react';
import styled from 'styled-components';
import DocumentTitle from '../DocumentTitle';
import colors from '../_base/colors';

const Header = styled.header`
  position: relative;
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  color: ${colors.lightBlue};
`;

const Shape = styled.img`
  position: absolute;
  grid-column: 1 / -1;
  width: 100%;
  z-index: -1;
`;

const Copy = styled.div`
  margin-top: calc((100vh / 12) * 2);
  grid-column: 2 / 8;

  h1 {
    padding-bottom: 2rem;
  }
`;

const HomePage = () => {
  return (
    <>
      <DocumentTitle title="dApps" />
      <Header>
        <Copy>
          <h1>Ethvault is a central location for your decentralised apps.</h1>
          <p>
            Ethvault is a free and open source Ethereum wallet and decentralized
            application launcher built for the browser.
          </p>
        </Copy>
        <Shape src="/header-shape.svg" />
      </Header>
    </>
  );
};

export default HomePage;
