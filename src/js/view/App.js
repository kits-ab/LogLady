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
      filePath: '',
      highlightColor: 'red',
      settingsPaneSize: '0px'
    };
    this.startListener();
  }

  handleHighlightColorInput = event => {
    this.setState({
      highlightColor: event.hex
    });
  };

  handleSettingsPaneSize = () => {
    this.setState({
      settingsPaneSize: !this.state.showSettings ? '270px' : '0px'
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

    this.props.send.getFileSize(argObj);
    this.props.send.getLiveLines(argObj);
    this.props.send.getNumberOfLines(argObj);
    // this.props.send.getNthLines(argObj);
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
            <LogViewer highlightColorInput={this.state.highlightColor} />
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
