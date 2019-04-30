import React from 'react';
import { connect } from 'react-redux';
import ReactToolTip from 'react-tooltip';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/dispatchActions';
import {
  getFormattedFileSize,
  getFormattedFilePath
} from './helpers/StatusBarHelper';
const settings = require('../../../resources/settings.png');

class StatusBar extends React.Component {
  render() {
    let test = 'tooltip';
    console.log(this.props.openFiles);

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
          <ReactToolTip />
          <li data-tip={test}>
            Path:{' '}
            {this.props.openFiles
              ? getFormattedFilePath(this.props.openFiles)
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
    openFiles: state.menuReducer.openFiles,
    numberOfLines: state.logInfoReducer.numberOfLines,
    fileSize: state.logInfoReducer.fileSize
  };
};

export default connect(mapStateToProps)(StatusBar);
