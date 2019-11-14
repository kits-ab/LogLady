import React, { useState } from 'react';
import {
  Tab,
  TabPanel,
  Button,
  Indicator
} from '../styledComponents/TabPanelStyledComponents';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import {
  updateSourceHandle,
  setLastSeenLogSizeToSize
} from '../actions/dispatchActions';
import { closeFile } from './helpers/handleFileHelper';

function TabPanelContainer(props) {
  const [state, setState] = useState({});
  const {
    menuState: { openSources, currentSourceHandle },
    logInfoState: { logSizes, lastSeenLogSizes },
    dispatch
  } = props;

  function tabOnClick(index) {
    const currentPath = openSources[currentSourceHandle].path;

    setLastSeenLogSizeToSize(dispatch, currentPath, logSizes[currentPath]);
    updateSourceHandle(dispatch, index);
  }

  function onMouseEnter(index) {
    setState({
      hover: index
    });
  }

  function onMouseLeave() {
    setState({
      hover: ''
    });
  }

  function exitLog(sourcePath, event) {
    closeFile(dispatch, sourcePath);
    event.stopPropagation();
  }

  return (
    <TabPanel>
      {Object.keys(openSources).map(source => {
        const path = openSources[source].path;
        const logSize = logSizes[path];
        const lastSeenLogSize = lastSeenLogSizes[path];

        return (
          <Tab
            key={openSources[source].index}
            selected={
              openSources[source].index === currentSourceHandle ? true : false
            }
            hover={openSources[source].index === state.hover ? true : false}
            index={openSources[source].index}
            onClick={() => {
              tabOnClick(openSources[source].index);
            }}
            onMouseEnter={() => {
              onMouseEnter(openSources[source].index);
            }}
            onMouseLeave={onMouseLeave}
          >
            {getFormattedFilePath(
              openSources[source].path,
              `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
            )}
            <Button
              onClick={event => {
                exitLog(openSources[source].path, event);
              }}
              hover={openSources[source].index === state.hover ? true : false}
              selected={
                openSources[source].index === currentSourceHandle ? true : false
              }
            >
              X
            </Button>
            <Indicator
              selected={
                openSources[source].index === currentSourceHandle ? true : false
              }
              activity={logSize !== lastSeenLogSize ? true : false}
            />
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
    menuState: state.menuState,
    logInfoState: state.logInfoState
  };
};

export default connect(mapStateToProps)(TabPanelContainer);
