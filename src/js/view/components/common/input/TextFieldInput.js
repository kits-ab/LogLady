import React from 'react';
import { TextFieldInputContainer } from 'js/view/styledComponents/common/InputStyledComponents';
import { connect } from 'react-redux';
class TextFieldInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text
    };
  }

  render() {
    return (
      <TextFieldInputContainer
        placeholder={this.props.placeholder}
        value={this.state.text}
        onChange={e => {
          this.setState({ text: e.target.value });
          this.props.onChange(this.props.dispatch, e.target.value);
        }}
        type="text"
      />
    );
  }
}

export default connect()(TextFieldInput);
