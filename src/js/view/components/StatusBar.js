import React from 'react';
import { connect } from 'react-redux';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/settingsActions';
const settings = require('../../../resources/settings.png');

class StatusBar extends React.Component {
  render() {
    console.log(this.props.fileSize);
    return (
      <StatusBarSC.Statusbar>
        <ul>
          <li>Path: {this.props.openFiles ? this.props.openFiles[0] : null}</li>

          <li>Lines:{this.props.numberOfLines}</li>

          <li>Size: {this.props.fileSize}</li>
          {this.props.openFiles ? (
            <li>
              <StatusBarSC.SettingIcon
                src={settings}
                onClick={() => {
                  handleShowSettings(this.props.dispatch);
                }}
                alt="settings"
              />
            </li>
          ) : null}
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
