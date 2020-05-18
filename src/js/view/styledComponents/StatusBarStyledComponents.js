import styled from 'styled-components';

export const Statusbar = styled.div`
  display: flex;
  flex-direction: row;
  height: 30px;
  width: 100%;
  border-top: 2px solid #e6e6e6;
  background-color: white;

  ul {
    list-style: none;
    color: black;
    margin: 3px;
    padding: 0px 0px 0px 10px;
  }

  li {
    padding-right: 10px;
    display: inline-block;
    font-size: 15px;
  }
`;
