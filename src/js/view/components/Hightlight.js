import React from 'react';
import { HighlightText } from '../styled_components/HighlightText';
import { matchHighlightText, matchRows, findMatches } from './highlight_helper';

class HighLight extends React.Component {
  constructor(props) {
    super(props);
    this.state = { highlightText: '' };
    // this.matchHighlightText(this.state.highlightText, this.props.rows);
  }

  onHightlightInput = event => {
    this.setState({ highlightText: event.target.value });
  };

  createRowArray = () => {
    const rowArray = [];
    rowArray.push(...this.props.rows);
    findMatches(this.state.highlightText, rowArray);
  };

  //   matchHighlightText = (textToHighlight, rows) => {
  //     let rowArray = [];
  //     rowArray.push(rows.split('\n'));

  //     return rowArray.filter(item => {
  //       const regex = new RegExp(textToHighlight, 'gi');
  //       //   console.log('item', item);

  //       return item.match(regex);
  //     });
  //   };

  render() {
    this.createRowArray();
    // const rows =
    //   this.props.rows &&
    //   matchHighlightText(this.state.highlightText, this.props.rows);
    // console.log('rows:', this.props.rows);

    // const rowArray = [];
    // rowArray.push(...this.props.rows);
    // console.log('rowArray:', rowArray);

    const rows =
      this.props.rows && matchRows(this.state.highlightText, this.props.rows);
    // return (
    //   <div>
    //     <input
    //       type="text"
    //       placeholder="highlight"
    //       onChange={this.onHightlightInput}
    //     />
    //     {rows &&
    //       rows.map(stuff => {
    //         const regex = new RegExp(this.state.highlightText, 'gi');
    //         return stuff.replace(regex, <Highlight>{rows}</Highlight>);
    //       })}
    //   </div>
    // );
    return (
      <div>
        <input
          type="text"
          placeholder="highlight"
          onChange={this.onHightlightInput}
        />
        {rows &&
          rows.map((row, i) => {
            return (
              <HighlightText active={true} key={i}>
                {row}
              </HighlightText>
            );
          })}
      </div>
    );
  }
}

export default HighLight;
