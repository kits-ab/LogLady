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
    const sourcePath = this.props.openSources[this.props.currentSourceHandle]
      .path;

    const filterText = this.props.settings[sourcePath]
      ? this.props.settings[sourcePath].filterInput
      : '';
    const highlightText = this.props.settings[sourcePath]
      ? this.props.settings[sourcePath].highlightInput
      : '';
    const tailSwitch = this.props.settings[sourcePath]
      ? this.props.settings[sourcePath].tailSwitch
      : true;

    console.log(filterText);
    console.log(highlightText);
    console.log(tailSwitch);

    return (
      <Stack wrap horizontal horizontalAlign="space-between">
        <Stack wrap horizontal tokens={stackTokens}>
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
                handleFilterInput(this.props.dispatch, { sourcePath, text });
              }}
              value={filterText}
            />
          </Stack.Item>
          <Stack.Item align="center">
            <TextFieldInput
              placeholder="Highlight"
              debounce={222}
              onTextChange={text => {
                handleHighlightInput(this.props.dispatch, { sourcePath, text });
              }}
              value={highlightText}
            />
          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item disableShrink align="center">
            <SwitchButton
              checked={tailSwitch}
              onChange={() => {
                handleTailSwitch(this.props.dispatch, { sourcePath });
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
  menuState: { openSources, currentSourceHandle },
  topPanelState: { settings }
}) => {
  return {
    currentSourceHandle,
    openSources,
    settings
  };
};

export default connect(mapStateToProps)(TopPanel);
