import React from 'react';
import reactStringReplace from 'react-string-replace';

class TextHighlightRegex extends React.Component {
  constructor(props) {
    super(props);
    debugger;
  }

  highlightMatches = (text, style, regex) => {
    const group = '(' + regex + ')'; //Parenthesis required for reactStringReplace to work properly
    return reactStringReplace(text, new RegExp(group, 'gi'), (match, i) => {
      return (
        <span key={i} style={style}>
          {match}
        </span>
      );
    });
  };

  highlightText = (text, style) => {
    return <span style={style}>{text}</span>;
  };

  render() {
    return this.highlightText(
      this.highlightMatches(
        this.props.text,
        this.props.matchStyle,
        this.props.regex
      ),
      this.props.textStyle
    );
  }
}

export default TextHighlightRegex;
