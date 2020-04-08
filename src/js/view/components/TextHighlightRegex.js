import React from 'react';
import {
  HighlightText,
  HighlightMatch
} from '../styledComponents/TextHighlightRegexStyledComponents';

class TextHighlightRegex extends React.Component {
  render() {
    return (
      <HighlightText color={this.props.color} style={this.props.style}>
        {this.props.line.sections.map((value, index) => {
          return value.highlightSection ? (
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
