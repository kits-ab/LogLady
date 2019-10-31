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
  const [state, setState] = useState({});
  console.log(props.state);
  function tabOnClick(index) {
    updateSourceHandle(props.dispatch, index);
    setState({
      active: index
    });
  }

  function onMouseEnter(index) {
    setState({
      ...state,
      hover: index
    });
  }

  function onMouseLeave() {
    setState({
      ...state,
      hover: ''
    });
  }

  function exitLog(sourcePath, event) {
    clearLog(props.dispatch, sourcePath);
    event.stopPropagation();
  }

  return (
    <TabPanel>
      {Object.keys(props.menuState.openSources).map(source => {
        return (
          <Tab
            key={props.menuState.openSources[source].index}
            selected={
              props.menuState.openSources[source].index === state.active
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
                props.menuState.openSources[source].index === state.active
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
