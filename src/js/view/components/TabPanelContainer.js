import React, { useState } from 'react';
import {
  Tab,
  TabPanel,
  Button
} from '../styledComponents/TabPanelStyledComponents';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import { updateSourceHandle } from '../actions/dispatchActions';
import { closeFile } from './helpers/handleFileHelper';

function TabPanelContainer(props) {
  const [state, setState] = useState({});

  function tabOnClick(index) {
    updateSourceHandle(props.dispatch, index);
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
    closeFile(props.dispatch, sourcePath);
    event.stopPropagation();
  }

  return (
    <TabPanel>
      {Object.keys(props.menuState.openSources).map(source => {
        return (
          <Tab
            key={props.menuState.openSources[source].index}
            selected={
              props.menuState.openSources[source].index ===
              props.menuState.currentSourceHandle
                ? true
                : false
            }
            hover={
              props.menuState.openSources[source].index === state.hover
                ? true
                : false
            }
            index={props.menuState.openSources[source].index}
            onClick={() => {
              tabOnClick(props.menuState.openSources[source].index);
            }}
            onMouseEnter={() => {
              onMouseEnter(props.menuState.openSources[source].index);
            }}
            onMouseLeave={onMouseLeave}
          >
            {getFormattedFilePath(
              props.menuState.openSources[source].path,
              `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
            )}
            <Button
              onClick={event => {
                exitLog(props.menuState.openSources[source].path, event);
              }}
              hover={
                props.menuState.openSources[source].index === state.hover
                  ? true
                  : false
              }
              selected={
                props.menuState.openSources[source].index ===
                props.menuState.currentSourceHandle
                  ? true
                  : false
              }
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
