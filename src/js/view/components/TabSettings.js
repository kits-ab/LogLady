import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import {
  handleShowSettings,
  handleHighlightColor,
  handleWrapLineSetting
} from '../actions/dispatchActions';
import {
  Settings,
  Setting,
  CloseButton
} from '../styledComponents/TabSettingsStyledComponents';

const close = require('../../../resources/close.png');
const { Component } = require('react');
const React = require('react');

class TabSettings extends Component {
  render() {
    return this.props.showSettings ? (
      <Settings>
        <Setting>
          <p>Color for highlights</p>
          <GithubPicker
            color={this.props.highlightColor}
            triangle={'hide'}
            onChangeComplete={e => {
              handleHighlightColor(this.props.dispatch, e.hex);
            }}
          />
        </Setting>
        <Setting>
          <p>Wrap Lines</p>
          <input
            type="checkbox"
            ref="wrapLineCheckBox"
            onClick={e => {
              handleWrapLineSetting(
                this.props.dispatch,
                this.refs.wrapLineCheckBox.checked
              );
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
