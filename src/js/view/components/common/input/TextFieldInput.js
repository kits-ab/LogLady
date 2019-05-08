import React from 'react';
import { TextFieldInputContainer } from 'js/view/styledComponents/common/InputStyledComponents';
import { connect } from 'react-redux';
class TextFieldInput extends React.Component {
  render() {
    return (
      <TextFieldInputContainer
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={e => {
          this.props.onChange(this.props.dispatch, e.target.value);
        }}
        type="text"
      />
    );
  }
}

export default connect()(TextFieldInput);
