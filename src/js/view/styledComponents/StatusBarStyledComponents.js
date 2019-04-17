import styled from 'styled-components';

export const Statusbar = styled.div`
  bottom: 0;
  height: 30px;
  width: 100%;
  border-top: 2px solid #e6e6e6;
  position: fixed;
  right: 0;
  left: 0;
  background-color: greenYellow;
  display: flex;
  flex-direction: row;

  ul {
    list-style: none;
    color: #ff00ff;
    margin: 3px;
  }

  li {
    margin-top: -5px;
    padding-right: 10px;
    display: inline-block;
    font-size: 15px;
  }
`;

export const SettingIcon = styled.img`
  margin: 5px 0 5px 17px;
  width: 20px;
`;
