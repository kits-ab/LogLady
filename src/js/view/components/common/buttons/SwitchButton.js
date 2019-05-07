import React from 'react';
import { connect } from 'react-redux';
import { SwitchButtonContainer } from 'js/view/styledComponents/common/ButtonStyledComponents';
class SwitchButton extends React.Component {
  render() {
    return (
      <SwitchButtonContainer>
        <input
          type="checkbox"
          defaultChecked={this.props.checked}
          ref="checkbox"
          onChange={this.props.onChange}
        />
        <span />
      </SwitchButtonContainer>
    );
  }
}

export default connect()(SwitchButton);
