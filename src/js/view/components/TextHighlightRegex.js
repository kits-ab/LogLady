import React from 'react';
import reactStringReplace from 'react-string-replace';
import {
  HighlightMatch,
  HighlightText
} from '../styledComponents/TextHighlightRegexStyledComponents';

class TextHighlightRegex extends React.Component {
  highlightMatches = (text, regex) => {
    return reactStringReplace(text, regex, (match, i) => {
      return <HighlightMatch key={i}>{match}</HighlightMatch>;
    });
  };

  render() {
    return (
      <HighlightText color={this.props.color}>
        {this.highlightMatches(this.props.text, this.props.regex)}
      </HighlightText>
    );
  }
}

export default TextHighlightRegex;
