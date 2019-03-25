import React from 'react';
import { HighlightText } from '../styled_components/HighlightText';
import { findMatches } from './highlight_helper';

class HighLight extends React.Component {
  constructor(props) {
    super(props);
    this.state = { highlightText: '', active: false };
  }

  onHightlightInput = event => {
    this.setState({ highlightText: event.target.value });
    this.createRowArray();
  };

  createRowArray = () => {
    const rowArray = [];
    rowArray.push(...this.props.rows.split('\n'));
    const matchArray = findMatches(this.state.highlightText, rowArray);
    const regex = new RegExp(this.state.highlightText, 'gi');

    if (regex.test(matchArray)) {
      this.setState({ active: true });
    }
    // if (matchArray === regex) {
    //   this.setState({ active: true });
    // }

    // return matchArray;
  };

  render() {
    const rows = this.props.rows;

    // const regex = new RegExp(this.state.highlightText, 'gi');
    return (
      <div>
        <input
          type="text"
          placeholder="highlight"
          onChange={this.onHightlightInput}
        />
        <HighlightText active={this.state.active}>{rows}</HighlightText>
      </div>
    );
  }
}

export default HighLight;
