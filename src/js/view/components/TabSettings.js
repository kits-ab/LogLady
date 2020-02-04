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
    return this.props.showSettings ? (
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item>
            <Label>Color for highlights</Label>
            <GithubPicker
              color={this.props.highlightColor}
              triangle={'hide'}
              onChangeComplete={e => {
                handleHighlightColor(this.props.dispatch, e.hex);
              }}
            />
          </Stack.Item>
          <Stack.Item>
            <Label>Wrap Lines</Label>
            <SwitchButton
              checked={this.props.wrapLineOn}
              onChange={() => {
                handleWrapLineOn(this.props.dispatch);
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
              handleShowSettings(this.props.dispatch);
            }}
          ></IconButton>
        </Stack>
      </Stack>
    ) : null;
  }
}

const mapStateToProps = ({
  settingsState: { showSettings, highlightColor, wrapLineOn }
}) => {
  return {
    showSettings,
    highlightColor,
    wrapLineOn
  };
};

export default connect(mapStateToProps)(TabSettings);
