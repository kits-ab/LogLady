import styled from 'styled-components';

export const Tab = styled.div`
  background-color: ${props => {
    return props.selected ? `darkgrey` : `#ccc`;
  }};

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #222;
  margin-left: 1px;
  /* border-top: 1px solid  #222;
    border-right: 1px solid #222;
    border-left: 1px solid  #222; */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export const TabPanel = styled.div`
  display: flex;
  flex-direction: row;
  background: #ccc;
  padding-top: 1px;
`;
