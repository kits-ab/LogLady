import TabSettings from './components/TabSettings';
import TabPanelContainer from './components/TabPanelContainer';
import LogViewer from './components/LogViewer';
import TopPanel from './components/TopPanel';
import DefaultPage from './components/DefaultPage';
import StatusBar from './components/StatusBar';
import SnackBar from './components/SnackBar';
import { getCurrentSource } from './reducers/menuReducer';
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
            <TabPanelContainer />
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

const mapStateToProps = ({ menuState }) => {
  return {
    currentSource: getCurrentSource(menuState)
  };
};

export default connect(mapStateToProps)(App);
