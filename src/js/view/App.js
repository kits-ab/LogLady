import TabSettings from './components/TabSettings';
import LogViewer from './components/LogViewer';
import TopPanel from './components/TopPanel';
import DefaultPage from './components/DefaultPage';
import StatusBar from './components/StatusBar';
import SnackBar from './components/SnackBar';
import {
  RootContainer,
  LogPage
} from 'js/view/styledComponents/AppStyledComponents';
import { connect } from 'react-redux';
const React = require('react');
const { Component } = require('react');

class App extends Component {
  render() {
    return (
      <RootContainer>
        {this.props.openFiles && this.props.openFiles[0] ? (
          <LogPage>
            <TopPanel />
            <TabSettings />
            <LogViewer />
            <StatusBar />
            <SnackBar />
          </LogPage>
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
