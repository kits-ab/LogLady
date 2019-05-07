import styled from 'styled-components';

export const Statusbar = styled.div`
  display: flex;
  flex-direction: row;
  height: 30px;
  width: 100%;
  border-top: 2px solid #e6e6e6;
  background-color: darkgrey;

  ul {
    list-style: none;
    color: white;
    margin: 3px;
  }

  li {
    padding-right: 10px;
    display: inline-block;
    font-size: 15px;
  }
`;

export const SettingIcon = styled.img`
  margin: 5px 0 5px 17px;
  width: 20px;
`;
