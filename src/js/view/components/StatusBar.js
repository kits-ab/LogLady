import React from 'react';
import { connect } from 'react-redux';
import * as StatusBarSC from '../styledComponents/StatusBarStyledComponents';
import {
  getFormattedFileSize,
  getFormattedFilePath
} from './helpers/StatusBarHelper';

class StatusBar extends React.Component {
  render() {
    return (
      <StatusBarSC.Statusbar>
        <ul>
          <li data-tip={this.props.source.path}>
            File:{' '}
            {this.props.source
              ? getFormattedFilePath(
                  this.props.source.path,
                  `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
                )
              : null}
          </li>
          <li>
            Size:{' '}
            {getFormattedFileSize(this.props.logSizes[this.props.source.path])}
          </li>
        </ul>
      </StatusBarSC.Statusbar>
    );
  }
}

const mapStateToProps = ({ logInfoState: { logSizes } }) => {
  return {
    logSizes
  };
};

export default connect(mapStateToProps)(StatusBar);
