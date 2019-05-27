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
        {this.props.currentSource ? (
          <LogPage>
            <TopPanel />
            <TabSettings />
            <LogViewer source={this.props.currentSource} />
            <StatusBar source={this.props.currentSource} />
          </LogPage>
        ) : (
          <DefaultPage />
        )}
        <SnackBar />
      </RootContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentSource:
      state.menuReducer.openSources[state.menuReducer.currentSourceHandle]
  };
};

export default connect(mapStateToProps)(App);
