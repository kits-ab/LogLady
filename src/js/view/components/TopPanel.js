import { TextFieldInput } from 'js/view/components/common/input';
import { SwitchButton } from 'js/view/components/common/buttons';
import React from 'react';
import {
  handleFilterInput,
  handleHighlightInput,
  handleTailSwitch
} from 'js/view/actions/dispatchActions';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
import { PrimaryButton, Stack, Image } from 'office-ui-fabric-react';

const logoText = require('../../../resources/text.png');

const stackTokens = {
  childrenGap: 16,
  padding: '8px 8px'
};

class TopPanel extends React.Component {
  render() {
    return (
      <Stack wrap horizontal horizontalAlign="space-between">
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item align="center">
            <Image src={logoText} height={40} />
          </Stack.Item>
          <Stack.Item align="center">
            <PrimaryButton
              text="Open file"
              onClick={() => {
                showOpenDialog();
              }}
            />
          </Stack.Item>
          <Stack.Item align="center">
            <TextFieldInput
              placeholder="Filter"
              debounce={222}
              onTextChange={text => {
                handleFilterInput(this.props.dispatch, text);
              }}
              value={this.props.filterInput}
            />
          </Stack.Item>
          <Stack.Item align="center">
            <TextFieldInput
              placeholder="Highlight"
              debounce={222}
              onTextChange={text => {
                handleHighlightInput(this.props.dispatch, text);
              }}
              value={this.props.highlightInput}
            />
          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item disableShrink align="center">
            <SwitchButton
              checked={this.props.tailSwitch}
              onChange={() => {
                handleTailSwitch(this.props.dispatch);
              }}
              label="Follow"
              onText="On"
              offText="Off"
            />
          </Stack.Item>
        </Stack>
      </Stack>
    );
  }
}

const mapStateToProps = ({
  menuState: { openFiles },
  topPanelState: { tailSwitch, filterInput, highlightInput }
}) => {
  return {
    openFiles,
    tailSwitch,
    filterInput,
    highlightInput
  };
};

export default connect(mapStateToProps)(TopPanel);
