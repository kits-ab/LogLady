import { Settings } from './Container';
const React = require('react');
const { Component } = require('react');

class TabSettings extends Component {
  render() {
    return (
      <div>
        <Settings>
          <h1>Settings for Tab</h1>
          <h2>Filter:</h2>
          <span>
            Errors: <input type="text" placeholder="ERROR" />
          </span>
          <input type="color" value="#e54d42" />
          <br />
          <span>
            Warnings: <input type="text" placeholder="WARN" />
          </span>
          <input type="color" name="color" value="#f0c330" />
          <br />
          <span>
            Infos: <input type="text" placeholder="INFO" />
          </span>
          <input type="color" name="color" value="#3a99d9" />
          <h2>Color on highlights:</h2>
          <span>Error:</span>
          <input type="color" name="color" value="#e54d42" />
          <span>Warnings:</span>
          <input type="color" name="color" value="#f0c330" />
          <span>Info:</span> <input type="color" name="color" value="#3a99d9" />
          <br />
          <span>Backgroundcolor</span>
          <input type="color" name="color" />
          <br />
          <span>Textcolor</span> <input type="color" name="color" />
          <br />
          <span>Timestamp: </span>
          <input type="checkbox" />
          <br />
          <span>MiniTail: </span> <input type="checkbox" />
          <br />
          <span>Background MiniTail: </span>
          <input type="color" name="color" value="#cccccc" />
          <br />
          <span>Textcolor MiniTail: </span>
          <input type="color" name="color" />
          <button>Save</button>
        </Settings>
      </div>
    );
  }
}
export default TabSettings;
