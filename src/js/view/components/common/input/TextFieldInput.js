import React from 'react';
import { TextFieldInputContainer } from 'js/view/styledComponents/common/InputStyledComponents';
import { connect } from 'react-redux';
import _ from 'lodash';
class TextFieldInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };
  }

  handleOnChange = event => {
    this.setState({
      input: event.target.value
    });
    this.sendDispatch();
  };

  sendDispatch = _.debounce(() => {
    this.props.onChange(this.props.dispatch, this.state.input);
  }, 222);

  render() {
    return (
      <TextFieldInputContainer
        placeholder={this.props.placeholder}
        value={this.state.input}
        onChange={event => {
          this.handleOnChange(event);
        }}
        type="text"
      />
    );
  }
}

export default connect()(TextFieldInput);
