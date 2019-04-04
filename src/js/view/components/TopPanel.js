import AppBar from '@material-ui/core/AppBar';
import Input from '@material-ui/core/Input';
import React from 'react';

class TopPanel extends React.Component {
  render() {
    return (
      <AppBar position="fixed" color="default">
        <p>LogLady</p>
        <Input />
      </AppBar>
    );
  }
}
export default TopPanel;
