import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import { SwitchButton } from 'js/view/components/common/buttons';
import {
  handleShowSettings,
  handleHighlightColor,
  handleWrapLineSetting
} from '../actions/dispatchActions';
import {
  Settings,
  Setting,
  CloseButton,
  SettingTitle
} from '../styledComponents/TabSettingsStyledComponents';

const close = require('../../../resources/close.png');
const { Component } = require('react');
const React = require('react');

class TabSettings extends Component {
  render() {
    return this.props.showSettings ? (
      <Settings>
        <Setting>
          <SettingTitle>Color for highlights</SettingTitle>
          <GithubPicker
            color={this.props.highlightColor}
            triangle={'hide'}
            onChangeComplete={e => {
              handleHighlightColor(this.props.dispatch, e.hex);
            }}
          />
        </Setting>
        <Setting>
          <SettingTitle>Wrap Lines</SettingTitle>
          <SwitchButton onChange={handleWrapLineSetting} />
        </Setting>
        <CloseButton
          onClick={() => {
            handleShowSettings(this.props.dispatch);
          }}
          src={close}
          alt="close"
        />
      </Settings>
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    showSettings: state.settingsReducer.showSettings,
    highlightColor: state.settingsReducer.highlightColor
  };
};

export default connect(mapStateToProps)(TabSettings);
