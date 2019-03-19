import { Statusbar, SettingIcon } from './Container';
const React = require('react');
const { Component } = require('react');
const { ipcRenderer } = window.require('electron');
const settings = require('../../resources/settings.png');
const error = require('../../resources/error.png');
const warning = require('../../resources/warning.png');
const info = require('../../resources/info.png');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastLines: '',
      nthLines: '',
      time: '',
      numberOfLines: ''
    };

    this.ipcContainer();
  }
  setLastLines = _returnValue => {
    this.setState({
      lastLines: _returnValue
    });
  };

  setNthLines = _returnValue => {
    this.setState({
      nthLines: _returnValue
    });
    //console.log('nth Lines: ', this.state.nthLines);
  };

  setTime = _returnValue => {
    let theTime = new Date(_returnValue);

    this.setState({
      time:
        theTime.toLocaleTimeString('sv-SE') + ':' + theTime.getMilliseconds()
    });
  };

  setNumberOfLines = _returnValue => {
    this.setState({
      numberOfLines: _returnValue
    });
  };

  ipcContainer = () => {
    //Create an object and pass it as arg to ipcRenderer.send()
    let argObj = {};
    argObj.filePath = 'src/resources/myLittleFile.txt';
    argObj.numberOfLines = 5;
    argObj.lineNumber = 10;

    //Just to show that our listener can be live.
    ipcRenderer.send('getTime', 'time');

    ipcRenderer.on('theTime', (event, time) => {
      this.setTime(time);
    });

    ipcRenderer.send('getNumberOfLines', argObj);

    ipcRenderer.once('numberOfLines', (event, numberOfLines) => {
      console.log(numberOfLines);
      this.setNumberOfLines(numberOfLines);
    });

    ipcRenderer.send('getNthLines', argObj);

    ipcRenderer.once('nthLines', (event, lines) => {
      console.log(lines);
      this.setNthLines(JSON.stringify(lines, null, 2));
    });

    ipcRenderer.send('getLastLines', argObj);

    ipcRenderer.once('lastLines', (event, lastLines) => {
      this.setLastLines(lastLines);
    });
  };

  render() {
    return (
      <div>
        {
          //<p>
          // Our listener can be live (and can keep up with ms): {this.state.time}{' '}
          //</p>
        }
        <p>Get last lines: {this.state.lastLines}</p>
        <p>
          Get Nth lines (5 rows starting from row 10): {this.state.nthLines}
        </p>
        Get Nth lines (with {'<pre>'} tags to keep json formatting):
        <pre>{this.state.nthLines}</pre>
        <Statusbar>
          <ul>
            <li>filePath</li>

            <li>lines:{this.state.numberOfLines}</li>

            <li>Storlek</li>

            <li>
              <img src={error} alt="error" /> : 1{' '}
            </li>

            <li>
              <img src={warning} alt="warnings" /> : 10
            </li>

            <li>
              <img src={info} alt="info" /> : 5{' '}
            </li>

            <li>
              <SettingIcon src={settings} alt="settings" />
            </li>
          </ul>
        </Statusbar>
      </div>
    );
  }
}

export default App;
