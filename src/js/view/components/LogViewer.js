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

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(
      document.querySelector('#liveLinesContainer'),
      observerConfig
    );

    window.addEventListener('keydown', e => {
      if (e.keyCode === 32) {
        this.handleAutoScroll();
      }
    });
  };

  createContainerObserver = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(
      document.querySelector('#liveLinesContainer'),
      observerConfig
    );
  };

  handleAutoScroll = () => {
    !this.state.autoScroll &&
      document
        .querySelector('#liveLinesContainer')
        .scrollTo(
          0,
          document.querySelector('#liveLinesContainer').scrollHeight
        );
    this.setState({
      autoScroll: !this.state.autoScroll
    });
  };

  scrollToBottom = () => {
    if (this.state.autoScroll) {
      document
        .querySelector('#liveLinesContainer')
        .scrollTo(
          0,
          document.querySelector('#liveLinesContainer').scrollHeight
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
          <p style={{ fontSize: '10px', color: 'green' }}>
            Autoscroll is active. Press space to deactivate it.
          </p>
        ) : (
          <p style={{ fontSize: '10px', color: 'red' }}>
            Press space to activate autoscroll.
          </p>
        )}
        <div
          id="liveLinesContainer"
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
