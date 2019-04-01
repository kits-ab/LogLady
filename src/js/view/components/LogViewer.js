import React from 'react';
import { GithubPicker } from 'react-color';
import { findMatches } from './lineFilter_helper';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      textToHighlight: '',
      highlightColor: 'red',
      autoScroll: false
    };

    this.liveLinesContainer = React.createRef();
  }

  onLineFilterInput = event => {
    this.setState({ lineFilterText: event.target.value });
  };

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.lines.split('\n'));
    const matchArray = findMatches(this.state.lineFilterText, lineArray);

    return matchArray;
  };

  onHighlightInput = event => {
    this.setState({
      textToHighlight: event.target.value
        ? new RegExp(event.target.value, 'gi')
        : ''
    });
  };

  onHighlightColorInput = color => {
    this.setState({ highlightColor: color.hex });
  };

  componentDidUpdate = () => {
    if (this.state.autoScroll !== this.props.activeTail) {
      this.handleAutoScroll();
    }
  };

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);

    window.addEventListener('keydown', e => {
      if (e.keyCode === 32) {
        this.handleAutoScroll();
      }
    });
  };

  createContainerObserver = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);
  };

  handleAutoScroll = () => {
    !this.state.autoScroll &&
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    this.setState({
      autoScroll: !this.state.autoScroll
    });
  };

  scrollToBottom = () => {
    if (this.state.autoScroll) {
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    }
  };

  render() {
    const lines = this.props.lines && this.createLineArray();
    return (
      <div>
        <GithubPicker
          color={this.state.highlightColor}
          onChangeComplete={this.onHighlightColorInput}
        />
        <input
          id="filterInput"
          type="text"
          placeholder="filter"
          onChange={this.onLineFilterInput}
        />
        <input
          type="text"
          placeholder="highlight"
          onChange={this.onHighlightInput}
        />
        {this.state.autoScroll ? (
          <p
            style={{
              fontSize: '10px',
              backgroundColor: 'green',
              width: '250px'
            }}
          >
            Tail is enabled. You can disable it in the settings tab.
          </p>
        ) : (
          <p
            style={{
              fontSize: '10px',
              backgroundColor: 'red',
              width: '250px'
            }}
          >
            Tail is disabled. You can enable it in the settings tab.
          </p>
        )}
        <div
          ref={this.liveLinesContainer}
          style={{
            overflow: 'auto',
            height: '300px',
            border: '1px black solid'
          }}
        >
          {lines &&
            lines.map((line, i) => {
              return (
                <p
                  style={
                    line.match(this.state.textToHighlight) &&
                    this.state.textToHighlight
                      ? { background: this.state.highlightColor }
                      : {}
                  }
                  key={i}
                >
                  {line}
                </p>
              );
            })}
        </div>
      </div>
    );
  }
}

export default LogViewer;
