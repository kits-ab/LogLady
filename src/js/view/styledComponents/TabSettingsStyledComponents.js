import styled from 'styled-components';

export const Settings = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  margin-top: 30px;
  position: fixed;
  color: #222;
  background: #ccc;
  justify-content: space-between;
`;

export const HighlightContainer = styled.div`
  padding: 10px;
  p {
    margin: 10px 0 5px 40px;
  }
`;

export const CloseButton = styled.img`
  float: right;
  width: 17px;
  margin: 27px 37px 0 0;
  height: 17px;
`;
