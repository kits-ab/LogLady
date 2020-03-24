/* eslint-disable react-hooks/exhaustive-deps */
import {
  Pivot,
  PivotItem,
  PivotLinkSize
} from 'office-ui-fabric-react/lib/Pivot';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getFormattedFilePath } from './helpers/StatusBarHelper';
import { Indicator } from '../styledComponents/TabPanelStyledComponent';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import {
  updateSourceHandle,
  setLastSeenLogSizeToSize
} from '../actions/dispatchActions';
import { closeFile, showOpenDialog } from './helpers/handleFileHelper';
import Mousetrap from 'mousetrap';
import { Stack, IconButton } from 'office-ui-fabric-react';
import ArrowDownward from 'rmdi/lib/ArrowDownward';

/**
 * Helper function to get actual modulo operation, as %-operator doesn't quite fit the bill
 */
function modulo(n, m) {
  return ((n % m) + m) % m;
}

function TabPanelContainer(props) {
  const {
    menuState: { openSources, currentSourceHandle },
    logInfoState: { logSizes, lastSeenLogSizes },
    dispatch
  } = props;

  // Set overflow on stack so that scrollbars appear when overflowing
  const stackStyles = {
    root: {
      overflowX: 'auto',
      overflowY: 'hidden'
    }
  };

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
    closeFile(dispatch, sourcePath);
  }

  useEffect(() => {
    /**
     * Calculates the index of the tab to the left and right of current tab, overflows to other end if needed
     * @param direction {Number} - The direction to look for tabs, 1 for forward/right and -1 for backward/left
     * @returns {Number} The index of the tab in the specified direction
     */
    const calculateIndexNeighbouringTabOfCurrent = direction => {
      const openSourcesKeys = Object.keys(props.menuState.openSources);
      let calculatedIndexToReturn = props.menuState.currentSourceHandle;

      // Loops through the keys of openSources looking for the current tab
      /* eslint-disable no-unused-vars */
      for (let sourceIndex in openSourcesKeys) {
        sourceIndex = parseInt(sourceIndex);
        let value = openSourcesKeys[sourceIndex];

        /* eslint-disable eqeqeq */
        if (value == props.menuState.currentSourceHandle) {
          // When current tab is found, calculate the index of the neighbouring tab in specified direction, using modulo to allow wrapping to other end
          calculatedIndexToReturn = parseInt(
            openSourcesKeys[
              modulo(sourceIndex + direction, openSourcesKeys.length)
            ]
          );
          break;
        }
      }
      return calculatedIndexToReturn;
    };

    Mousetrap.bind('ctrl+tab', () => {
      // Move forwards (the the right) in tab order
      tabOnClick(calculateIndexNeighbouringTabOfCurrent(1));
    });

    Mousetrap.bind('ctrl+shift+tab', () => {
      // Move backwards (to the left) in tab order
      tabOnClick(calculateIndexNeighbouringTabOfCurrent(-1));
    });

    return function cleanup() {
      Mousetrap.unbind('ctrl+tab');
      Mousetrap.unbind('ctrl+shift+tab');
    };
  }, [props.menuState]);

  return (
    <Stack horizontal verticalAlign="center" styles={stackStyles}>
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
      <IconButton
        iconProps={{ iconName: 'Add' }}
        onClick={() => {
          showOpenDialog();
        }}
      />
    </Stack>
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
              exitLog(openSources[source].path, event);
            }}
            style={{ display: 'inline-block', marginLeft: '10px' }}
          >
            <Icon iconName="Cancel" />
          </div>
          <Indicator
            selected={
              openSources[source].index === currentSourceHandle ? true : false
            }
            activity={logSize !== lastSeenLogSize ? true : false}
            viewBox="0 0 80 80"
          >
            <ArrowDownward size={80} color="#2e86de" />
          </Indicator>
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
