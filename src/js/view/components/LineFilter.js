import React from 'react';
import { findMatches } from './lineFilter_helper';

class LineFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { LineFilterText: '', highlightText: '' };
  }

  onLineFilterInput = event => {
    this.setState({ LineFilterText: event.target.value });
  };

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.lines.split('\n'));
    const matchArray = findMatches(this.state.LineFilterText, lineArray);

    return matchArray;
  };

  onHighlightInput = event => {
    this.setState({ highlightText: event.target.value });
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
              <p active={this.state.active} key={i}>
                {line}
              </p>
            );
          })}
      </div>
    );
  }
}

export default LineFilter;
