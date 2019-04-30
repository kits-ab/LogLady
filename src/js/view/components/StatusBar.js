import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/dispatchActions';
import {
  getFormattedFileSize,
  getFormattedFilePath,
  ifToLongFileName
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
          <li
            data-tip={
              this.props.openFiles
                ? ifToLongFileName(this.props.openFiles[0])
                : null
            }
          >
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
