import React from 'react';
import * as TextHighlightRegexSC from '../styledComponents/TextHighlightRegexStyledComponents';

class TextHighlightRegex extends React.Component {
  highlightMatches = (text, regex) => {
    let array = [];
    let result;
    let input = text;

    // read until no more matches
    while (input && (result = regex.exec(input))) {
      const textBeforeMatch = input.slice(0, result.index);
      const match = result[0];

      //if textBeforeMatch is '' it means there was no characters between this match and the previous match, so append it to the previous match
      if (!textBeforeMatch && array.length > 0) {
        array[array.length - 1].highlight += match;
      } else {
        //normal text are strings and higlighted items are wrapped in an object so that we can see what text got highlighted later
        array.push(textBeforeMatch);
        array.push({ highlight: match });
      }

      //update input without the text added
      input = input.slice(Math.max(1, textBeforeMatch.length + match.length));
    }

    //add the text after the last match
    array.push(input.slice(0));

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
        {this.highlightMatches(this.props.text, this.props.regex).map(
          (x, i) => {
            return x.highlight ? this.toHighlightElement(x.highlight, i) : x;
          }
        )}
      </TextHighlightRegexSC.HighlightText>
    );
  }
}

export default TextHighlightRegex;
