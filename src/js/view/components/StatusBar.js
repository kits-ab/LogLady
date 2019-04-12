import React from 'react';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import { handleShowSettings } from '../actions/settingsActions';
const settings = require('../../../resources/settings.png');

class StatusBar extends React.Component {
  render() {
    return (
      <StatusBarSC.Statusbar>
        <ul>
          <li>Path: {this.props.filePath}</li>

          <li>Lines:{this.props.numberOfLines}</li>

          <li>Size: {this.props.fileSize}</li>

          <li>
            <StatusBarSC.SettingIcon
              src={settings}
              onClick={() => {
                handleShowSettings(this.props.dispatch);
              }}
              alt="settings"
            />
          </li>
        </ul>
      </StatusBarSC.Statusbar>
    );
  }
}

export default StatusBar;
