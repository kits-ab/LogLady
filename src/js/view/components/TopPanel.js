import { TextFieldInput } from 'js/view/components/common/input';
import { SwitchButton } from 'js/view/components/common/buttons';
import React from 'react';
import {
  handleFilterInput,
  handleHighlightInput,
  handleTailSwitch,
  handleShowSettings
} from 'js/view/actions/dispatchActions';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
import {
  PrimaryButton,
  Stack,
  Image,
  TooltipHost
} from 'office-ui-fabric-react';
import { SettingIcon } from '../styledComponents/TopPanelStyledComponents';
const settings = require('../../../resources/settings.png');
const logoText = require('../../../resources/text.png');

const stackTokens = {
  childrenGap: 16,
  padding: '8px 8px'
};

class TopPanel extends React.Component {
  render() {
    const sourcePath = this.props.openSources[this.props.currentSourceHandle]
      .path;

    // Get sane defaults if settings object is not initialized
    // and prevents crashes due to undefined objects
    const filterText = this.props.settings[sourcePath]
      ? this.props.settings[sourcePath].filterInput
      : '';
    const highlightText = this.props.settings[sourcePath]
      ? this.props.settings[sourcePath].highlightInput
      : '';
    const tailSwitch = this.props.settings[sourcePath]
      ? this.props.settings[sourcePath].tailSwitch
      : true;

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
              disabled={this.props.logSizes[sourcePath] > 10000000}
              label={'Filter'}
              placeholder={
                this.props.logSizes[sourcePath] > 10000000
                  ? 'File too large'
                  : 'Filter'
              }
              debounce={300}
              onTextChange={text => {
                handleFilterInput(this.props.dispatch, { sourcePath, text });
              }}
              value={filterText}
            />
          </Stack.Item>
          <Stack.Item align="center">
            <TextFieldInput
              placeholder="Highlight"
              label={'Highlight'}
              debounce={300}
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
          <Stack.Item align="center">
            <TooltipHost
              content="Show settings"
              id="openSettings"
              styles={{ root: { display: 'inline-block' } }}
            >
              <SettingIcon
                src={settings}
                onClick={() => {
                  handleShowSettings(this.props.dispatch, {
                    sourcePath
                  });
                }}
                alt="settings"
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>
      </Stack>
    );
  }
}

const mapStateToProps = ({
  menuState: { openSources, currentSourceHandle },
  topPanelState: { settings },
  logInfoState: { logSizes }
}) => {
  return {
    currentSourceHandle,
    openSources,
    settings,
    logSizes
  };
};

export default connect(mapStateToProps)(TopPanel);
