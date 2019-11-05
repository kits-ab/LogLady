import React from 'react';
import {
  HighlightText,
  HighlightMatch
} from '../styledComponents/TextHighlightRegexStyledComponents';
import { groupByMatches } from 'js/view/components/helpers/regexHelper';

class TextHighlightRegex extends React.Component {
  render() {
    return (
      <HighlightText color={this.props.color} style={this.props.style}>
        {groupByMatches(
          this.props.text.replace(/\[\/?HLL\]/g, ''),
          /\[(HLG\d+)\](?<text>.*)\[\/\1\]/
        ).map((value, index) => {
          return value.matched ? (
            <HighlightMatch key={index}>{value.text}</HighlightMatch>
          ) : (
            value.text
          );
        })}
      </HighlightText>
    );
  }
}

export default TextHighlightRegex;
