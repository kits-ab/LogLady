import React from 'react';
import logo from 'resources/log_lady3.png';
import {
  DefaultPageContainer,
  WelcomeText,
  LogLadyLogo,
  KeyIcon
} from '../styledComponents/DefaultPageStyledComponents';
import { OpenFileButton } from '../styledComponents/common/ButtonStyledComponents';
import { osSpecificKeyBindings } from './helpers/defaultPageHelper';
import { showOpenDialog } from './helpers/handleFileHelper';

class DefaultPage extends React.Component {
  render() {
    return (
      <DefaultPageContainer>
        <LogLadyLogo src={logo} />

        <WelcomeText>
          <OpenFileButton
            onClick={() => {
              showOpenDialog();
            }}
          >
            Open File
          </OpenFileButton>
          <KeyIcon>{osSpecificKeyBindings()}</KeyIcon> + <KeyIcon>O</KeyIcon>
        </WelcomeText>
      </DefaultPageContainer>
    );
  }
}

export default DefaultPage;
