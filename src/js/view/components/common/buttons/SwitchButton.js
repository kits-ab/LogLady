import React from 'react';
import { connect } from 'react-redux';
import { Toggle } from 'office-ui-fabric-react';

// Set toggle margin to zero so it lines up with the other components
const toggleStyles = {
  root: { margin: '0' }
};

class SwitchButton extends React.Component {
  render() {
    return (
      <Toggle
        defaultChecked={this.props.checked}
        label={this.props.label}
        inlineLabel
        ref="checkbox"
        onChange={this.props.onChange}
        onText={this.props.onText}
        offText={this.props.offText}
        styles={toggleStyles}
      />
    );
  }
}

export default connect()(SwitchButton);
