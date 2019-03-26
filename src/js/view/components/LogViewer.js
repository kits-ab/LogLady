import React from 'react';
import { findMatches } from './lineFilter_helper';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      textToHighlight: ''
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

  render() {
    const lines = this.props.lines && this.createLineArray();
    return (
      <div>
        <input
          type="text"
          placeholder="filter"
          onChange={this.onLineFilterInput}
        />
        <input
          type="text"
          placeholder="highlight"
          onChange={this.onHighlightInput}
        />
        {lines &&
          lines.map((line, i) => {
            return (
              <p
                style={
                  line.match(this.state.textToHighlight) &&
                  this.state.textToHighlight
                    ? { background: 'red' }
                    : {}
                }
                key={i}
              >
                {line}
              </p>
            );
          })}
      </div>
    );
  }
}

export default LogViewer;
