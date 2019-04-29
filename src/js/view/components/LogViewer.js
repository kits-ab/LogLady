import React from 'react';
import { findMatches } from './helpers/lineFilterHelper';
import * as LogViewerSC from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.liveLinesContainer = React.createRef();
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.liveLines.split('\n'));
    const matchArray = findMatches(this.props.filterInput, lineArray);

    return matchArray;
  };

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);
  };

  scrollToBottom = () => {
    if (this.props.tailSwitch) {
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    }
  };

  setTextColorForHighlight = () => {
    switch (this.props.highlightColor) {
      case '#b80000':
        return '#eeefea';
      case '#db3e00':
        return '#eeefea';
      case '#008b02':
        return '#eeefea';
      case '#006b76':
        return '#eeefea';
      case '#1273de':
        return '#eeefea';
      case '#004dcf':
        return '#eeefea';
      case '#5300eb':
        return '#eeefea';
      default:
        return '#222';
    }
  };

  setHighlightColor = line => {
    // let textColor = setTextColorForHighlight
    return line.match(new RegExp(this.props.highlightInput, 'gi')) &&
      this.props.highlightInput
      ? {
          background: this.props.highlightColor,
          color: this.setTextColorForHighlight()
        }
      : {};
  };

  render() {
    const lines = this.props.liveLines && this.createLineArray();
    console.log(this.props.highlightColor);
    return (
      <LogViewerSC.TextContainer ref={this.liveLinesContainer}>
        <LogViewerSC.CloseFileButton
          openFiles={this.props.openFiles}
          onClick={() => {
            closeFile(
              this.props.dispatch,
              this.props.openFiles ? this.props.openFiles : ''
            );
          }}
        />
        {lines &&
          lines.map((line, i) => {
            return (
              <p style={this.setHighlightColor(line)} key={i}>
                {line}
              </p>
            );
          })}
      </LogViewerSC.TextContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterInput: state.topPanelReducer.filterInput,
    highlightInput: state.topPanelReducer.highlightInput,
    highlightColor: state.settingsReducer.highlightColor,
    liveLines: state.logViewerReducer.liveLines,
    nthLines: state.logViewerReducer.nthLines,
    tailSwitch: state.topPanelReducer.tailSwitch,
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(LogViewer);
