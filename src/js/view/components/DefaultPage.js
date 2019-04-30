import React from 'react';
import logo from 'resources/log_lady3.png';
import {
  DefaultPageContainer,
  WelcomeText,
  LogLadyLogo
} from '../styledComponents/DefaultPageStyledComponents';
import { OpenFileButton } from '../styledComponents/common/ButtonStyledComponents';
import { osSpecificKeyBindings } from './helpers/defaultPageHelper';
class DefaultPage extends React.Component {
  render() {
    return (
      <DefaultPageContainer>
        <LogLadyLogo src={logo} />

        <WelcomeText>
          <OpenFileButton>Open File</OpenFileButton>
          {osSpecificKeyBindings()}
        </WelcomeText>
      </DefaultPageContainer>
    );
  }
}

export default DefaultPage;
