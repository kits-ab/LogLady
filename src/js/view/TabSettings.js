import { Settings, CloseButton } from './Container';
import { GithubPicker } from 'react-color';

const React = require('react');
const { Component } = require('react');
const close = require('../../resources/close.png');

class TabSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettings: true
    };
  }
  closeSettings = () => {
    this.setState({
      showSettings: !this.state.showSettings
    });
  };

  render() {
    return this.state.showSettings ? (
      <Settings>
        <CloseButton
          onClick={() => {
            this.closeSettings();
          }}
          src={close}
          alt="close"
        />
        <h1>Settings for Tab</h1>
        <h2>Filter:</h2>
        <span>Custom: </span>
        <input
          id="filterInput"
          type="text"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
        />
        <h2>Highlights:</h2>
        <span>Custom: </span>
        <input
          type="text"
          value={this.props.higlightInputFieldValue}
          onChange={this.props.higlightInputField}
        />
        <GithubPicker
          color={this.props.highlightColor}
          onChangeComplete={this.props.highlightColorInput}
        />
        <br />
      </Settings>
    ) : null;
  }
}
export default TabSettings;
