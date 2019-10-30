import React, { useState } from 'react';
import {
  Tab,
  TabPanel,
  Button
} from '../styledComponents/TabPanelStyledComponents';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import { clearLog, updateSourceHandle } from '../actions/dispatchActions';
function TabPanelContainer(props) {
  const [state, setState] = useState(0);

  function tabOnClick(index) {
    updateSourceHandle(props.dispatch, index);
    setState(index);
  }
  console.log(props.state);

  function exitLog(sourcePath) {
    clearLog(props.dispatch, sourcePath);
  }

  return (
    <TabPanel>
      {Object.keys(props.menuState.openSources).map(source => {
        console.log(source);
        return (
          <Tab
            key={props.menuState.openSources[source].index}
            selected={
              props.menuState.openSources[source].index === state ? true : false
            }
            index={props.menuState.openSources[source].index}
            onClick={() => {
              tabOnClick(props.menuState.openSources[source].index);
            }}
          >
            {getFormattedFilePath(
              props.menuState.openSources[source].path,
              `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
            )}
            <Button
              onClick={() => {
                exitLog(props.menuState.openSources[source].path);
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
    menuState: state.menuState
  };
};

export default connect(mapStateToProps)(TabPanelContainer);
