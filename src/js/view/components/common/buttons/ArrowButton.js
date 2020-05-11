import * as React from 'react';
import { connect } from 'react-redux';
// import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { IconButton } from 'office-ui-fabric-react';
// initializeIcons();

class ArrowButton extends React.Component {
  render() {
    return (
      <IconButton
        onClick={this.props.onClick}
        iconProps={this.props.iconProps}
      />
    );
  }
}
export default connect()(ArrowButton);
