import styled from 'styled-components';

export const TopPanelContainer = styled.div`
  background-color: darkgrey;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
  align-items: stretch;
  justify-content: start;
  top: 0;
`;

export const TopPanelItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const TopPanelItemText = styled.div`
  display: flex;
  padding: 0px 8px;
  color: white;
`;

export const FollowSetting = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
