import styled from 'styled-components';

export const FlexParent = styled.div`
  display: flex;
  align-items: center;
`;

export const FlexChildGrow = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
`;

export const FlexChildFixed = styled.div`
  flex-shrink: 0;
`;
