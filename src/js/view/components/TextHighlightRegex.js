import React from 'react';
import {
  HighlightText,
  HighlightMatch
} from '../styledComponents/TextHighlightRegexStyledComponents';
import { groupByMatches } from 'js/view/components/helpers/regexHelper';

class TextHighlightRegex extends React.Component {
  toHighlightElement = (text, i) => {
    return <HighlightMatch key={i}>{text}</HighlightMatch>;
  };

  render() {
    return (
      <HighlightText color={this.props.color}>
        {groupByMatches(this.props.text, this.props.regex).map((x, i) => {
          return x.matched ? this.toHighlightElement(x.text, i) : x.text;
        })}
      </HighlightText>
    );
  }
}

export default TextHighlightRegex;
