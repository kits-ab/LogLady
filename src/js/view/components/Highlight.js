import React from 'react';

class Highlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textToHighlight: '' };
  }

  onHighlightInput = event => {
    this.setState({ highlightText: event.target.value });
  };

  render() {
    // const higlights = this.props.highlights.map(highlight => {
    //   return;
    // });
    return (
      <div>
        <input
          type="text"
          placeholder="highlight"
          onChange={this.onHighlightInput}
        />
        <p>{this.state.textToHighlight}</p>
      </div>
    );
  }
}

export default Highlight;
