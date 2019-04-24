import React from 'react';
import { findMatches } from './helpers/lineFilterHelper';
import * as LogViewerSC from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
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

  setHighlightColor = line => {
    return line.match(new RegExp(this.props.highlightInput, 'gi')) &&
      this.props.highlightInput
      ? { background: this.props.highlightColor }
      : {};
  };

  render() {
    const lines = this.props.liveLines && this.createLineArray();
    return (
      // <div style={{ height: '100vh' }}>
      <LogViewerSC.TextContainer ref={this.liveLinesContainer}>
        {lines &&
          lines.map((line, i) => {
            return (
              <p style={this.setHighlightColor(line)} key={i}>
                {line}
              </p>
            );
          })}
      </LogViewerSC.TextContainer>
      // </div>
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
    tailSwitch: state.topPanelReducer.tailSwitch
  };
};

export default connect(mapStateToProps)(LogViewer);
