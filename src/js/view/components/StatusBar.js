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
          <li data-tip={this.props.openSources[0]}>
            File:{' '}
            {this.props.openSources && this.props.openSources[0]
              ? getFormattedFilePath(this.props.openSources[0])
              : null}
          </li>
          <li>Lines:{this.props.numberOfLines}</li>
          <li>Size: {getFormattedFileSize(this.props.fileSize)}</li>
        </ul>
      </StatusBarSC.Statusbar>
    );
  }
}

const mapStateToProps = state => {
  return {
    openSources: state.menuReducer.openSources,
    numberOfLines: state.logInfoReducer.numberOfLines,
    fileSize: state.logInfoReducer.fileSize
  };
};

export default connect(mapStateToProps)(StatusBar);
