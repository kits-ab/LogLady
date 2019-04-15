import React from 'react';
import { connect } from 'react-redux';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/settingsActions';
const settings = require('../../../resources/settings.png');

class StatusBar extends React.Component {
  render() {
    console.log(this.props.openFiles);
    return (
      <StatusBarSC.Statusbar>
        <ul>
          <li>Path: {this.props.filePath}</li>

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

// export default StatusBar;

const mapStateToProps = state => {
  return {
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(StatusBar);
