import React from 'react';
import { findMatches } from './helpers/lineFilterHelper';
import * as LogViewerSC from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import Color from 'color';
import TextHighlightRegex from './TextHighlightRegex';

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

  styleHighlightedText = backgroundColor => {
    const matchingTextColor = {
      '#b80000': '#eeefea',
      '#db3e00': '#eeefea',
      '#008b02': '#eeefea',
      '#006b76': '#eeefea',
      '#1273de': '#eeefea',
      '#004dcf': '#eeefea',
      '#5300eb': '#eeefea',
      default: '#222'
    };

    const textColor = matchingTextColor[backgroundColor];

    return {
      background: backgroundColor,
      color: textColor ? textColor : matchingTextColor.default
    };
  };

  styleHighlightedMatch = () => {
    return {
      background: 'yellow',
      opacity: '0.5',
      color: 'black',
      fontWeight: 'bold'
    };
  };

  hasMatch = (line, regex) => {
    return regex && line.match(new RegExp(regex, 'i'));
  };

  stripe = (i, color) => {
    return {
      background:
        i & 1
          ? color
          : Color(color)
              .darken(0.5)
              .hex()
    };
  };

  render() {
    const lines = this.props.liveLines && this.createLineArray();
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
              <p key={i} style={this.stripe(i, '#222')}>
                {this.hasMatch(line, this.props.highlightInput) ? (
                  <TextHighlightRegex
                    text={line}
                    style={this.styleHighlightedText(this.props.highlightColor)}
                    matchStyle={this.styleHighlightedMatch()}
                    regex={this.props.highlightInput}
                  />
                ) : (
                  line
                )}
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
