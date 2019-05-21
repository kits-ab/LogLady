import TabSettings from './components/TabSettings';
import LogViewer from './components/LogViewer';
import TopPanel from './components/TopPanel';
import DefaultPage from './components/DefaultPage';
import Statusbar from './components/StatusBar';
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
        {this.props.source ? (
          <LogPage>
            <TopPanel />
            <TabSettings />
            <LogViewer source={this.props.source} />
            <Statusbar />
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
    source: state.menuReducer.openSources[0]
  };
};

export default connect(mapStateToProps)(App);
