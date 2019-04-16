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

const store = createStore(reducers);
ipcListener(store.dispatch, store.getState());

class App extends Component {
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
            <LogViewer />
          </div>
          <div
            style={{
              background: 'linear-gradient(mediumspringgreen, magenta)'
            }}
          >
            <TabSettings dispatch={store.dispatch} />
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
