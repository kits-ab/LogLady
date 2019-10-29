import React, { useState } from 'react';
import {
  Tab,
  TabPanel,
  Button
} from '../styledComponents/TabPanelStyledComponents';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import { clearLog } from '../actions/dispatchActions';
function TabPanelContainer(props) {
  const [state, setState] = useState(0);

  function tabOnClick(index) {
    setState(index);
  }
  console.log(props.state);

  function exitLog(sourcePath) {
    clearLog(props.dispatch, sourcePath);
  }

  return (
    <TabPanel>
      {Object.keys(props.logViewerState.logs).map((log, index) => {
        return (
          <Tab
            key={index}
            selected={index === state ? true : false}
            index={index}
            onClick={() => {
              tabOnClick(index);
            }}
          >
            {getFormattedFilePath(
              log,
              `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
            )}
            <Button
              onClick={() => {
                exitLog(log);
              }}
            >
              X
            </Button>
          </Tab>
        );
      })}
      <Tab onClick={showOpenDialog}> + </Tab>
    </TabPanel>
  );
}

const mapStateToProps = function(state) {
  return {
    state: state,
    logViewerState: state.logViewerState
  };
};

export default connect(mapStateToProps)(TabPanelContainer);
