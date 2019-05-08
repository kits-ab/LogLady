import styled from 'styled-components';

export const DefaultPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  color: #ccc;
  overflow: hidden;
  background: #222;
`;

export const LogLadyLogo = styled.img`
  width: 512px;
  height: 512px;
`;

export const WelcomeText = styled.div`
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 250px;
  align-items: center;
`;

export const KeyIcon = styled.div`
  display: block;
  height: 27px;
  min-width: 29px;
  background: #ccc;
  border: 1px solid #a9a9a9;
  border-radius: 2px 2px 2px 2px;
  -moz-border-radius: 2px 2px 2px 2px;
  -webkit-border-radius: 2px 2px 2px 2px;
  font-size: 12px;
  -moz-box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  text-align: center;
  padding-top: 5.5px;
  color: #222;
  -webkit-box-shadow: 0px 3px 0px -2px #ccc,
    0px 2px 0px 0px rgba(169, 169, 169, 1);
  -moz-box-shadow: 0px 3px 0px -2px #ccc;
  box-shadow: 0px 3px 0px -2px #ccc;
`;
