import styled from 'styled-components';

export const FeedView = styled.div`
  border-top: 12px dashed ${props => (props.live ? 'red' : 'grey')};
  border-bottom: 12px dashed ${props => (props.live ? 'red' : 'grey')};
  color: #333;
  padding: 20px;
`;
