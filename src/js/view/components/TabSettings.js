import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import {
  handleShowSettings,
  handleHighlightColor
} from '../actions/dispatchActions';
import * as TabSettingsSC from '../styledComponents/TabSettingsStyledComponents';

const close = require('../../../resources/close.png');
const { Component } = require('react');
const React = require('react');

class TabSettings extends Component {
  render() {
    return this.props.showSettings ? (
      <TabSettingsSC.Settings>
        <TabSettingsSC.CloseButton
          onClick={() => {
            handleShowSettings(this.props.dispatch);
          }}
          src={close}
          alt="close"
        />
        <h1>Settings for Tab</h1>

        <h2>Highlights:</h2>
        <p>Color for highlights</p>
        <GithubPicker
          color={this.props.highlightColor}
          onChangeComplete={e => {
            handleHighlightColor(this.props.dispatch, e.hex);
          }}
        />
        <br />
      </TabSettingsSC.Settings>
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
