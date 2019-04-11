import React from 'react';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
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
                this.settingClick();
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
