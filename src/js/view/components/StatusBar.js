import React from 'react';
import { connect } from 'react-redux';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/dispatchActions';
const settings = require('../../../resources/settings.png');

class StatusBar extends React.Component {
  getFormattedFileSize = fileSize => {
    if (fileSize >= 1000000000) {
      return `${(fileSize / 1000000000).toFixed(2)} gigabytes`;
    } else if (fileSize >= 1000000) {
      return `${(fileSize / 1000000).toFixed(2)} megabytes`;
    } else if (fileSize >= 1000) {
      return `${(fileSize / 1000).toFixed(2)} kilobytes`;
    } else if (fileSize) {
      return `${fileSize} bytes`;
    } else {
      return `${0} bytes`;
    }
  };

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
          <li>Path: {this.props.openFiles ? this.props.openFiles[0] : null}</li>
          <li>Lines:{this.props.numberOfLines}</li>
          <li>Size: {this.getFormattedFileSize(this.props.fileSize)}</li>
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
