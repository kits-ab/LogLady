import TabSettings from './components/TabSettings';
import LogViewer from './components/LogViewer';
import TopPanel from './components/TopPanel';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index.js';
import { ipcListener } from './ipcListener';
import * as ipcPublisher from './ipcPublisher';
import Statusbar from './components/StatusBar';
import { RootContainer } from './styledComponents/AppStyledComponents';
const React = require('react');
const { Component } = require('react');

const store = createStore(reducers);
ipcListener(store.dispatch);

class App extends Component {
  render() {
    return (
      <RootContainer>
        <TopPanel />
        <TabSettings />
        <LogViewer />
        <Statusbar />
      </RootContainer>
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
