import React from 'react';
import reactStringReplace from 'react-string-replace';
import * as TextHighlightRegexSC from '../styledComponents/TextHighlightRegexStyledComponents';

class TextHighlightRegex extends React.Component {
  highlightMatches = (text, regex) => {
    const group = '(' + regex + ')'; //Parenthesis required for reactStringReplace to work properly
    return reactStringReplace(text, new RegExp(group, 'gi'), (match, i) => {
      return (
        <TextHighlightRegexSC.HighlightMatch key={i}>
          {match}
        </TextHighlightRegexSC.HighlightMatch>
      );
    });
  };

  highlightText = (text, style) => {
    return <span style={style}>{text}</span>;
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
