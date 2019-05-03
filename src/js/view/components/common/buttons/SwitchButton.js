import React from 'react';
import { connect } from 'react-redux';
import { SwitchButtonContainer } from 'js/view/styledComponents/common/ButtonStyledComponents';
class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked ? this.props.checked : false
    };
  }

  render() {
    return (
      <SwitchButtonContainer>
        <input
          type="checkbox"
          checked={this.state.checked}
          ref="checkbox"
          onChange={() => {
            this.setState({ checked: this.refs.checkbox.checked });
            this.props.onChange(
              this.props.dispatch,
              this.refs.checkbox.checked
            );
          }}
        />
        <span />
      </SwitchButtonContainer>
    );
  }
}

export default connect()(SwitchButton);
