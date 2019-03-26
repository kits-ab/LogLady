import { Settings } from './Container';
const React = require('react');
const { Component } = require('react');

class TabSettings extends Component {
  render() {
    return (
      <Settings>
        <h1>Settings for Tab</h1>
        <span>Background-color:</span>
        <input type="color" name="color" value="#ffffff" />
        <br />
        <span>Text-color:</span> <input type="color" name="color" />
        <br />
        <h2>Filter:</h2>
        <input type="color" value="#e54d42" />
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
        <h2>Highlights:</h2>
        <span>Errors:</span>
        <input type="color" name="color" value="#e54d42" />
        <br />
        <span>Warnings:</span>
        <input type="color" name="color" value="#f0c330" /> <br />
        <span>Informations:</span>{' '}
        <input type="color" name="color" value="#3a99d9" /> <br />
        <br />
        <span>MiniTail: </span> <input type="checkbox" />
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
        <button>Save</button>
      </Settings>
    );
  }
}
export default TabSettings;
