import styled from 'styled-components';

export const Statusbar = styled.div`
  position: fixed;
  bottom: 0;
  background-color: #cccccc05;
  width: 100%;
  border-top: 2px solid #e6e6e6;

  ul {
    list-style: none;
    color: #a6a6a6;
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

export const Settings = styled.div`
  width: 300px;

  bottom: 0;
  float: right;
  margin: 0;
  padding: 0;

  color: #373737;
  padding: 30px;

  h1,
  h2 {
    font-size: 16px;
  }

  input[type='color'] {
    border: none;
  }

  input[type='text'] {
    width: 100px;
    margin-left: 20px;
  }
`;
