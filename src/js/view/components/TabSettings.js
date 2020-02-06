import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import { SwitchButton } from 'js/view/components/common/buttons';
import {
  handleShowSettings,
  handleHighlightColor,
  handleWrapLineOn
} from '../actions/dispatchActions';
import { Stack, IconButton, Label } from 'office-ui-fabric-react';

const { Component } = require('react');
const React = require('react');

const stackTokens = {
  childrenGap: 16,
  padding: '8px 8px'
};

class TabSettings extends Component {
  render() {
    const sourcePath = this.props.openSources[this.props.currentSourceHandle]
      .path;

    const showSettings = this.props.tabSettings[sourcePath]
      ? this.props.tabSettings[sourcePath].showSettings
      : false;
    const highlightColor = this.props.tabSettings[sourcePath]
      ? this.props.tabSettings[sourcePath].highlightColor
      : 'red';
    const wrapLineOn = this.props.tabSettings[sourcePath]
      ? this.props.tabSettings[sourcePath].wrapLineOn
      : false;

    return showSettings ? (
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item>
            <Label>Color for highlights</Label>
            <GithubPicker
              color={highlightColor}
              triangle={'hide'}
              onChangeComplete={e => {
                handleHighlightColor(this.props.dispatch, {
                  color: e.hex,
                  sourcePath
                });
              }}
            />
          </Stack.Item>
          <Stack.Item>
            <Label>Wrap Lines</Label>
            <SwitchButton
              checked={wrapLineOn}
              onChange={() => {
                handleWrapLineOn(this.props.dispatch, { sourcePath });
              }}
              onText="On"
              offText="Off"
            />
          </Stack.Item>
        </Stack>
        <Stack tokens={stackTokens}>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            onClick={() => {
              handleShowSettings(this.props.dispatch, { sourcePath });
            }}
          ></IconButton>
        </Stack>
      </Stack>
    ) : null;
  }
}

const mapStateToProps = ({
  settingsState: { tabSettings },
  menuState: { openSources, currentSourceHandle }
}) => {
  return {
    tabSettings,
    openSources,
    currentSourceHandle
  };
};

export default connect(mapStateToProps)(TabSettings);
