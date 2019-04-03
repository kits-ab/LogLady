import React from 'react';
import { findMatches } from './lineFilter_helper';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      autoScroll: false
    };

    this.liveLinesContainer = React.createRef();
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.lines.split('\n'));
    const matchArray = findMatches(this.props.filterInputFieldValue, lineArray);

    return matchArray;
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
        <input
          id="filterInput"
          type="text"
          placeholder="filter"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
        />
        <input
          type="text"
          placeholder="highlight"
          value={this.props.higlightInputFieldValue}
          onChange={this.props.higlightInputField}
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
                    line.match(
                      new RegExp(this.props.higlightInputFieldValue, 'gi')
                    ) && this.props.higlightInputFieldValue
                      ? { background: this.props.highlightColorInput }
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
