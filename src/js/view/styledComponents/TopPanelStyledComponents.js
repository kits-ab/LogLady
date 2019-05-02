import styled from 'styled-components';

export const TopPanelContainer = styled.div`
  background-color: darkgrey;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: start;
`;

export const TopPanelItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const TopPanelItemText = styled.div`
  padding: 0px 8px;
  color: white;
`;

export const TopPanelItemFiller = styled.div`
  flex: 1;
`;

export const FollowSetting = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
