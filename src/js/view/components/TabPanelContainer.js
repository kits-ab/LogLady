import {
  Pivot,
  PivotItem,
  PivotLinkSize
} from 'office-ui-fabric-react/lib/Pivot';
import React from 'react';
import { TabPanel } from '../styledComponents/TabPanelStyledComponent';
import { connect } from 'react-redux';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import { Indicator } from '../styledComponents/TabPanelStyledComponent';

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

  function exitLog(sourcePath, event) {
    event.stopPropagation();
    console.log('Exit log');
    closeFile(dispatch, sourcePath);
  }

  return (
    <TabPanel>
      <div>
        <Pivot
          linkSize={PivotLinkSize.large}
          onLinkClick={onLinkClick}
          selectedKey={currentSourceHandle}
        >
          {Object.keys(openSources).map(source => {
            const path = openSources[source].path;
            const index = openSources[source].index;
            const logSize = logSizes[path];
            const lastSeenLogSize = lastSeenLogSizes[path];

            return (
              <PivotItem
                headerText={getFormattedFilePath(
                  openSources[source].path,
                  `${navigator.platform.startsWith('Win') ? '\\' : '/'}`
                )}
                onRenderItemLink={customRenderer(
                  openSources,
                  source,
                  exitLog,
                  currentSourceHandle,
                  logSize,
                  lastSeenLogSize
                )}
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

function customRenderer(
  openSources,
  source,
  exitLog,
  currentSourceHandle,
  logSize,
  lastSeenLogSize
) {
  return function _customRenderer(link, defaultRenderer) {
    return (
      <span>
        {defaultRenderer(link)}
        <div style={{ display: 'inline' }}>
          <div
            onClick={event => {
              console.log('clickevent');
              exitLog(openSources[source].path, event);
            }}
            style={{ display: 'inline-block', marginLeft: '10px' }}
          >
            X
          </div>
          <Indicator
            selected={
              openSources[source].index === currentSourceHandle ? true : false
            }
            activity={logSize !== lastSeenLogSize ? true : false}
          />
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
