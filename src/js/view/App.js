
import { Statusbar, SettingIcon, Wrapper } from './Container';
import TabSettings from './TabSettings';
import LogViewer from './components/LogViewer';

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
      numberOfLines: '',

      liveLines: '',
      autoScroll: false,
      filePath: '',
      showSettings: false,
      fileSize: ''
    };

    this.startListener();
  }
  onTabChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  setLiveLines = _returnValue => {
    this.setState({
      liveLines: this.state.liveLines + '\n' + _returnValue
    });
  };

  setLastLines = _returnValue => {
    this.setState({
      lastLines: _returnValue
    });
  };

  setNthLines = _returnValue => {
    this.setState({
      nthLines: _returnValue
    });
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

  setFilePath = _returnValue => {
    this.setState({
      filePath: _returnValue
    });
  };

  setFileSize = _returnValue => {
    this.setState({
      fileSize: _returnValue
    });
  };

  startListener = () => {
    ipcRenderer.on('filePath', (event, filePath) => {
      this.setFilePath(filePath.toString());
      this.ipcContainer();
    });
  };

  ipcContainer = () => {
    console.log('filepath: ', this.state.filePath);
    //Create an object and pass it as arg to ipcRenderer.send()
    let argObj = {};
    argObj.filePath = this.state.filePath;
    argObj.numberOfLines = 5;
    argObj.lineNumber = 10;

    //Just to show that our listener can be live.
    ipcRenderer.send('getTime', 'time');

    ipcRenderer.on('theTime', (event, time) => {
      this.setTime(time);
    });

    ipcRenderer.send('getLiveLines', argObj);

    ipcRenderer.on('liveLines', (event, lines) => {
      this.setLiveLines(lines);
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

    ipcRenderer.send('getFileSize', argObj);
    ipcRenderer.once('fileSize', (event, size) => {
      this.setFileSize(size);
    });

    window.addEventListener('keydown', e => {
      if (e.keyCode === 32) {
        this.handleAutoScroll();
      }
    });
  };

  handleAutoScroll = () => {
    this.setState({
      autoScroll: !this.state.autoScroll
    });
  };

  settingClick = () => {
    this.setState({
      showSettings: !this.state.showSettings
    });
  };

  render() {
    this.state.autoScroll && window.scrollTo(0, document.body.scrollHeight);

    return (
      <Wrapper>
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
        {this.state.showSettings ? <TabSettings /> : null}
        <pre>{this.state.nthLines}</pre>
        <LogViewer lines={this.state.liveLines} />
        <Statusbar>
          <ul>
            <li>filePath: {this.state.filePath}</li>

            <li>lines:{this.state.numberOfLines}</li>

            <li>Storlek: {this.state.fileSize}</li>

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
              <SettingIcon
                src={settings}
                onClick={() => {
                  this.settingClick();
                }}
                alt="settings"
              />
            </li>
          </ul>
        </Statusbar>
      </Wrapper>
    );
  }
}

export default App;
