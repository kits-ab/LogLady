import styled from 'styled-components';

export const Statusbar = styled.div`
  bottom: 0;
  width: 100%;
  border-top: 2px solid #e6e6e6;
  clear: both;
  position: fixed;
  right: 0;
  left: 0;
  background-color: greenYellow;

  ul {
    list-style: none;
    color: #ff00ff;
    margin: 3px;
  }

  li {
    padding: 0 10px;
    display: inline-block;
    font-size: 15px;
  }

  li > img {
    width: 14px;
  }
`;

export const SettingIcon = styled.img`
  width: 20px;
  float: right;
  padding: 0 40px;
`;
