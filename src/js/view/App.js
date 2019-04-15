import TabSettings from './components/TabSettings';
import LogViewer from './components/LogViewer';
import TopPanel from './components/TopPanel';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index.js';
import { ipcListener } from './ipcListener';
import * as ipcPublisher from './ipcPublisher';
import Statusbar from './components/StatusBar';
const React = require('react');
const { Component } = require('react');
const { ipcRenderer } = window.require('electron');

const store = createStore(reducers);
ipcListener(store.dispatch);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastLines: '',
      nthLines: '',
      liveLines: '',
      filePath: '',
      highlightColor: 'red',
      highlightInputFieldValue: '',
      filterInputFieldValue: '',
      settingsPaneSize: '0px'
    };
    this.startListener();
  }

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

  handleSettingsPaneSize = () => {
    this.setState({
      settingsPaneSize: !this.state.showSettings ? '270px' : '0px'
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

  setFilePath = _returnValue => {
    this.setState({
      filePath: _returnValue
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

    ipcRenderer.send('getLiveLines', argObj);

    ipcRenderer.on('liveLines', (event, lines) => {
      this.setLiveLines(lines);
    });

    ipcRenderer.send('getNumberOfLines', argObj);

    ipcRenderer.send('getNthLines', argObj);

    ipcRenderer.once('nthLines', (event, lines) => {
      this.setNthLines(JSON.stringify(lines, null, 2));
    });

    this.props.send.getLastLines(argObj);

    ipcRenderer.once('lastLines', (event, lastLines) => {
      this.setLastLines(lastLines);
    });

    this.props.send.getFileSize(argObj);
  };

  render() {
    return (
      <div>
        <div>
          <TopPanel dispatch={store.dispatch} />
        </div>
        <div>
          <div
            style={{
              height: '600px'
            }}
          >
            <LogViewer
              lines={this.state.liveLines}
              highlightColorInput={this.state.highlightColor}
              higlightInputField={this.handleHiglightInputField}
              higlightInputFieldValue={this.state.highlightInputFieldValue}
            />
          </div>
          <div
            style={{
              background: 'linear-gradient(mediumspringgreen, magenta)'
            }}
          >
            {store.getState().settingsReducer.showSettings ? (
              <TabSettings
                handleSettingsPaneSize={this.handleSettingsPaneSize}
                highlightColorInput={this.handleHighlightColorInput}
              />
            ) : null}
          </div>
        </div>
        <Statusbar dispatch={store.dispatch} />
      </div>
    );
  }
}

class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App send={ipcPublisher} />
      </Provider>
    );
  }
}

export default AppContainer;
