import { Statusbar, SettingIcon } from './Container';
import TabSettings from './TabSettings';
import LogViewer from './components/LogViewer';
import SplitPane from 'react-split-pane';
//import '../../css/App.css';
import TopPanel from './components/TopPanel';

const React = require('react');
const { Component } = require('react');
const { ipcRenderer } = window.require('electron');
const settings = require('../../resources/settings.png');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastLines: '',
      nthLines: '',
      time: '',
      numberOfLines: '',
      liveLines: '',
      filePath: '',
      showSettings: false,
      fileSize: '',
      highlightColor: 'red',
      highlightInputFieldValue: '',
      filterInputFieldValue: '',
      activeTail: true,
      settingsPaneSize: '0px'
    };
    this.startListener();
  }

  handleActiveTail = () => {
    this.setState({
      activeTail: !this.state.activeTail
    });
  };

  handleHighlightColorInput = event => {
    this.setState({
      highlightColor: event.hex
    });
  };

  handleHiglightInputField = event => {
    this.setState({
      highlightInputFieldValue: event.target.value ? event.target.value : ''
    });
  };

  handleFilterInputField = event => {
    this.setState({
      filterInputFieldValue: event.target.value
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
      this.setNumberOfLines(numberOfLines);
    });

    ipcRenderer.send('getNthLines', argObj);

    ipcRenderer.once('nthLines', (event, lines) => {
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
  };

  settingClick = () => {
    this.setState({
      settingsPaneSize: !this.state.showSettings ? '270px' : '0px'
    });
    this.setState({
      showSettings: !this.state.showSettings
    });
  };

  render() {
    return (
      <div>
        <div>
          <TopPanel
            activeTail={this.handleActiveTail}
            higlightInputField={this.handleHiglightInputField}
            higlightInputFieldValue={this.state.highlightInputFieldValue}
            filterInputField={this.handleFilterInputField}
            filterInputFieldValue={this.state.filterInputFieldValue}
          />
        </div>
        <div>
          <SplitPane
            split="vertical"
            defaultSize={this.state.settingsPaneSize}
            allowResize={false}
            primary="second"
          >
            <div>
              <LogViewer
                lines={this.state.liveLines}
                activeTail={this.state.activeTail}
                highlightColorInput={this.state.highlightColor}
                higlightInputField={this.handleHiglightInputField}
                higlightInputFieldValue={this.state.highlightInputFieldValue}
                filterInputField={this.handleFilterInputField}
                filterInputFieldValue={this.state.filterInputFieldValue}
              />
            </div>
            <div>
              {this.state.showSettings ? (
                <TabSettings
                  highlightColorInput={this.handleHighlightColorInput}
                  higlightInputField={this.handleHiglightInputField}
                  higlightInputFieldValue={this.state.highlightInputFieldValue}
                  filterInputField={this.handleFilterInputField}
                  filterInputFieldValue={this.state.filterInputFieldValue}
                />
              ) : null}
            </div>
          </SplitPane>
        </div>
        <Statusbar>
          <ul>
            <li>Path: {this.state.filePath}</li>

            <li>Lines:{this.state.numberOfLines}</li>

            <li>Size: {this.state.fileSize}</li>

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
      </div>
    );
  }
}

export default App;
