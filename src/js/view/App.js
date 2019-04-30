import TabSettings from './components/TabSettings';
import LogViewer from './components/LogViewer';
import TopPanel from './components/TopPanel';
import DefaultPage from './components/DefaultPage';
import { createStore } from 'redux';
import reducers from './reducers/index.js';
import { ipcListener } from './ipcListener';
import Statusbar from './components/StatusBar';
import { RootContainer } from './styledComponents/AppStyledComponents';
import { connect } from 'react-redux';
const React = require('react');
const { Component } = require('react');

const store = createStore(reducers);
ipcListener(store.dispatch);

class App extends Component {
  render() {
    return (
      <RootContainer>
        {this.props.openFiles ? (
          <div>
            <TopPanel />
            <TabSettings />
            <LogViewer />
            <Statusbar />
          </div>
        ) : (
          <DefaultPage />
        )}
      </RootContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(App);
