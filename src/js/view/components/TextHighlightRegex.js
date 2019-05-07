import React from 'react';
import * as TextHighlightRegexSC from '../styledComponents/TextHighlightRegexStyledComponents';

class TextHighlightRegex extends React.Component {
  highlightMatches = (text, regex) => {
    let array = [];
    let result;
    let input = text;

    while ((result = regex.exec(input))) {
      const nomatch = input.slice(0, result.index);
      const match = result[0];

      if (!nomatch && array.length > 0) {
        array[array.length - 1].highlight += match;
      } else {
        array.push(nomatch);
        array.push({ highlight: match });
      }

      input = input.slice(nomatch.length + match.length);
    }

    array.push(input.slice(0));

    console.log(array);
    return array.map((x, i) => {
      return x.highlight ? this.toHighlightElement(x.highlight, i) : x;
    });
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
