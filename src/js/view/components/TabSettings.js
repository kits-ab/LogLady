import * as TabSettingsSC from '../styledComponents/TabSettingsStyledComponents';
import { GithubPicker } from 'react-color';

const React = require('react');
const { Component } = require('react');
const close = require('../../../resources/close.png');

class TabSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettings: true
    };
  }

  render() {
    return this.state.showSettings ? (
      <TabSettingsSC.Settings>
        <TabSettingsSC.CloseButton
          onClick={() => {
            this.props.closeSettings();
          }}
          src={close}
          alt="close"
        />
        <h1>Settings for Tab</h1>

        <h2>Highlights:</h2>
        <p>Color for highlights</p>
        <GithubPicker
          color={this.props.highlightColor}
          onChangeComplete={this.props.highlightColorInput}
        />
        <br />
      </TabSettingsSC.Settings>
    ) : null;
  }
}
export default TabSettings;
