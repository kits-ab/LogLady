import { connect } from 'react-redux';
import { SwitchButton } from 'js/view/components/common/buttons';
import {
  handleShowSettings,
  handleHighlightColor,
  handleWrapLineOn
} from '../actions/dispatchActions';
import {
  Stack,
  IconButton,
  Label,
  SwatchColorPicker
} from 'office-ui-fabric-react';

const { Component } = require('react');
const React = require('react');

const stackTokens = {
  childrenGap: 16,
  padding: '8px 8px'
};

class TabSettings extends Component {
  _menuButtonElement = React.createRef();
  state = {
    isCalloutVisible: false
  };

  _onShowMenuClicked = () => {
    this.setState({
      isCalloutVisible: !this.state.isCalloutVisible
    });
  };

  _onCalloutDismiss = () => {
    this.setState({
      isCalloutVisible: false
    });
  };

  render() {
    const sourcePath = this.props.openSources[this.props.currentSourceHandle]
      .path;

    const showSettings = this.props.tabSettings[sourcePath]
      ? this.props.tabSettings[sourcePath].showSettings
      : false;
    const highlightColor = this.props.tabSettings[sourcePath]
      ? this.props.tabSettings[sourcePath].highlightColor
      : 'red';
    const wrapLineOn = this.props.tabSettings[sourcePath]
      ? this.props.tabSettings[sourcePath].wrapLineOn
      : false;

    return showSettings ? (
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item>
            <Label style={{ paddingLeft: '5.5px' }}>Color for highlights</Label>
            <div>
              <SwatchColorPicker
                columnCount={5}
                cellShape={'circle'}
                colorCells={[
                  { id: 'a', label: 'red', color: '#a4262c' },
                  { id: 'a', label: 'orange', color: '#ca5010' },
                  { id: 'f', label: 'cyan', color: '#038387' },
                  { id: 'c', label: 'blueMagenta', color: '#8764b8' },
                  { id: 'g', label: 'cyanBlue', color: '#004e8c' }
                ]}
                selectedId={highlightColor}
                cellHeight={35}
                cellWidth={35}
                onColorChanged={(e, clr) => {
                  handleHighlightColor(this.props.dispatch, {
                    color: clr,
                    sourcePath
                  });
                }}
              />
            </div>
          </Stack.Item>
          <Stack.Item>
            <Label>Wrap Lines</Label>
            <div style={{ paddingTop: '13px' }}>
              <SwitchButton
                checked={wrapLineOn}
                onChange={() => {
                  handleWrapLineOn(this.props.dispatch, { sourcePath });
                }}
                onText="On"
                offText="Off"
              />
            </div>
          </Stack.Item>
        </Stack>
        <Stack tokens={stackTokens}>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            onClick={() => {
              handleShowSettings(this.props.dispatch, { sourcePath });
            }}
          ></IconButton>
        </Stack>
      </Stack>
    ) : null;
  }
}

const mapStateToProps = ({
  settingsState: { tabSettings },
  menuState: { openSources, currentSourceHandle }
}) => {
  return {
    tabSettings,
    openSources,
    currentSourceHandle
  };
};

export default connect(mapStateToProps)(TabSettings);
