import {
  Pivot,
  PivotItem,
  PivotLinkSize
} from 'office-ui-fabric-react/lib/Pivot';
//import { Label } from 'office-ui-fabric-react/lib/Label';
import React from 'react';
import { TabPanel } from '../styledComponents/TabPanelStyledComponents';
import { connect } from 'react-redux';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import {
  updateSourceHandle,
  setLastSeenLogSizeToSize
} from '../actions/dispatchActions';
import { closeFile } from './helpers/handleFileHelper';

function TabPanelContainer(props) {
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

  const onLinkClick = function(PivotItem) {
    const index = PivotItem.props.index;
    tabOnClick(index);
  };

  /* function onMouseEnter(index) {
    setState({
      hover: index
    });
  }

  function onMouseLeave() {
    setState({
      hover: ''
    });
  }
  */
  function exitLog(sourcePath, event) {
    event.stopPropagation();
    console.log('Exit log');
    closeFile(dispatch, sourcePath);
  }

  return (
    <TabPanel>
      {/*     {Object.keys(openSources).map(source => {
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
      <Tab onClick={showOpenDialog}> + </Tab> */}
      <div>
        <Pivot
          linkSize={PivotLinkSize.large}
          onLinkClick={onLinkClick}
          selectedKey={currentSourceHandle}
        >
          {Object.keys(openSources).map(source => {
            // const path = openSources[source].path;
            const index = openSources[source].index;
            /* const logSize = logSizes[path];
            const lastSeenLogSize = lastSeenLogSizes[path]; */

            return (
              <PivotItem
                headerText={getFormattedFilePath(
                  openSources[source].path,
                  `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
                )}
                onRenderItemLink={customRenderer(openSources, source, exitLog)}
                index={index}
                key={source}
                itemKey={index}
              ></PivotItem>
            );
          })}
        </Pivot>
      </div>
    </TabPanel>
  );
}

function customRenderer(openSources, source, exitLog) {
  return function _customRenderer(link, defaultRenderer) {
    return (
      <span>
        {defaultRenderer(link)}
        <div style={{ display: 'inline' }}>
          {/* <ActionButton
            iconProps={{ iconName: 'Cancel' }}
            allowDisabledFocus
            disabled={false}
            checked={false}
            onClick={event => {
              exitLog(openSources[source].path, event);
            }}
          /> */}

          <div
            onClick={event => {
              console.log('clickevent');
              exitLog(openSources[source].path, event);
            }}
            style={{ display: 'inline-block', marginLeft: '10px' }}
          >
            X
          </div>
        </div>
      </span>
    );
  };
}

const mapStateToProps = function(state) {
  return {
    state: state,
    menuState: state.menuState,
    logInfoState: state.logInfoState
  };
};

export default connect(mapStateToProps)(TabPanelContainer);
