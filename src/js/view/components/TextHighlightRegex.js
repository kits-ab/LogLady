import React from 'react';
import reactStringReplace from 'react-string-replace';
import * as TextHighlightRegexSC from '../styledComponents/TextHighlightRegexStyledComponents';

class TextHighlightRegex extends React.Component {
  highlightMatches = (text, regexInput) => {
    const regex = new RegExp(regexInput, 'gi');
    let matches = text.match(regex);
    let unmatches = text.split(regex);

    let array = [];
    let currentMatch = '';
    for (let i = 0; i < matches.length; i++) {
      if (unmatches[i] === '') {
        currentMatch += matches[i];
      } else {
        array.push(this.toHighlightElement(currentMatch, i));
        array.push(unmatches[i]);
      }
    }

    array.push(this.toHighlightElement(currentMatch, unmatches.length - 1));
    array.push(unmatches[unmatches.length - 1]);

    return array;
  };

  toHighlightElement = (text, i) => {
    return (
      <TextHighlightRegexSC.HighlightMatch key={i}>
        {text}
      </TextHighlightRegexSC.HighlightMatch>
    );
  };

  render() {
    return (
      <TextHighlightRegexSC.HighlightText color={this.props.color}>
        {this.highlightMatches(this.props.text, this.props.regex)}
      </TextHighlightRegexSC.HighlightText>
    );
  }
}

export default TextHighlightRegex;
