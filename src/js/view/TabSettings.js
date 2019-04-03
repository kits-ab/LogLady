import { Settings, SaveButton, CloseButton } from './Container';
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
        <span>Background-color:</span>
        <input type="color" name="color" value="#ffffff" />
        <br />
        <span>Text-color:</span> <input type="color" name="color" />
        <br />
        <h2>Filter:</h2>
        <span>Custom: </span>
        <input id="filterInput" type="text" onChange={this.onLineFilterInput} />
        {/*<br />
        <span>
          Errors: <input type="text" placeholder="ERROR" />
        </span>
        <br />
        <span>
          Warnings: <input type="text" placeholder="WARN" />
        </span>
        <br />
        <span>
          Informations: <input type="text" placeholder="INFO" />
        </span> */}
        <h2>Highlights:</h2>
        <span>Custom: </span>
        <input type="text" onChange={this.onHighlightInput} />
        <GithubPicker
          color={this.state.highlightColor}
          onChangeComplete={this.onHighlightColorInput}
        />
        {/*<input type="color" value="#e54d42" />
        <span>
          Errors: <input type="text" placeholder="ERROR" />
        </span>
        <br />
        <input type="color" name="color" value="#f0c330" />
        <span>
          Warnings: <input type="text" placeholder="WARN" />
        </span>
        <br />
        <input type="color" name="color" value="#3a99d9" />
        <span>
          Informations: <input type="text" placeholder="INFO" />
        </span>
        */}
        <br />
        <span>MiniTail: </span>{' '}
        <input type="checkbox" onChange={this.props.activeTail} />
        <br />
        <span>Background-color: MiniTail </span>
        <input type="color" name="color" value="#cccccc" />
        <br />
        <span>Text-color: MiniTail </span>
        <input type="color" name="color" />
        <br />
        <br />
        <span>Timestamp: </span>
        <input type="checkbox" />
        <br />
        <SaveButton
          onClick={() => {
            this.closeSettings();
          }}
        >
          Save
        </SaveButton>
      </Settings>
    ) : null;
  }
}
export default TabSettings;
