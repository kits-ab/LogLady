import styled from 'styled-components';

export const RootContainer = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  min-width: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`;

export const LogPage = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;
