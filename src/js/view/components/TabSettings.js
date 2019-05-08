import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import { SwitchButton } from 'js/view/components/common/buttons';
import {
  handleShowSettings,
  handleHighlightColor,
  handleWrapLineOn
} from '../actions/dispatchActions';
import {
  TabSettingsContainer,
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
      <TabSettingsContainer>
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
          <SwitchButton
            checked={this.props.wrapLineOn}
            onChange={() => {
              handleWrapLineOn(this.props.dispatch);
            }}
          />
        </Setting>
        <CloseButton
          onClick={() => {
            handleShowSettings(this.props.dispatch);
          }}
          src={close}
          alt="close"
        />
      </TabSettingsContainer>
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    showSettings: state.settingsReducer.showSettings,
    highlightColor: state.settingsReducer.highlightColor,
    wrapLineOn: state.settingsReducer.wrapLineOn
  };
};

export default connect(mapStateToProps)(TabSettings);
