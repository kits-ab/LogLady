import React from 'react';
import { SketchPicker } from 'react-color';
import { findMatches } from './lineFilter_helper';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      textToHighlight: '',
      highlightColor: 'red'
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

  render() {
    const lines = this.props.lines && this.createLineArray();
    return (
      <div>
        <input
          id="filterInput"
          type="text"
          placeholder="filter"
          onChange={this.onLineFilterInput}
        />
        <SketchPicker
          color={this.state.highlightColor}
          onChangeComplete={this.onHighlightColorInput}
        />
        <input
          type="text"
          placeholder="highlight"
          onChange={this.onHighlightInput}
        />
        <div
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
