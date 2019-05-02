import styled from 'styled-components';

export const TopPanelContainer = styled.div`
  background-color: darkgrey;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
  align-items: center;
  justify-content: space-evenly;
  top: 0;
  p {
    margin: 0 28px 0 28px;
    color: white;
  }
`;

export const TopPanelItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
`;

export const FollowSetting = styled.div`
  display: flex;
  flex-direction: row;
`;
