import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/dispatchActions';
import {
  getFormattedFileSize,
  getFormattedFilePath
} from './helpers/StatusBarHelper';
const settings = require('../../../resources/settings.png');

class StatusBar extends React.Component {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    return (
      <StatusBarSC.Statusbar>
        <StatusBarSC.SettingIcon
          src={settings}
          onClick={() => {
            handleShowSettings(this.props.dispatch);
          }}
          alt="settings"
        />

        <ul>
          <ReactTooltip />
          <li data-tip={this.props.source}>
            File:
            {this.props.source ? getFormattedFilePath(this.props.source) : null}
          </li>
          <li>
            Size:
            {getFormattedFileSize(this.props.logSizes[this.props.source])}
          </li>
        </ul>
      </StatusBarSC.Statusbar>
    );
  }
}

const mapStateToProps = state => {
  return {
    logSizes: state.logInfoReducer.logSizes
  };
};

export default connect(mapStateToProps)(StatusBar);
