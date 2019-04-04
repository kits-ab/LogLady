import AppBar from '@material-ui/core/AppBar';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import React from 'react';

class TopPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSwitch: true
    };
  }

  handleActiveSwitch = () => {
    this.setState({ activeSwitch: !this.state.activeSwitch });
  };

  render() {
    return (
      <AppBar position="fixed" color="default">
        <p>LogLady</p>
        <TextField
          label="filter"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
          margin="normal"
          variant="filled"
          fullWidth={false}
          styles={{ flex: '1' }}
        />
        <input
          id="filterInput"
          type="text"
          placeholder="filter"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
        />
        <input
          type="text"
          placeholder="highlight"
          value={this.props.higlightInputFieldValue}
          onChange={this.props.higlightInputField}
        />
        <div style={{ float: 'right', marginRight: '1.5%' }}>
          <span>Tail: </span>{' '}
          <Switch
            color="primary"
            checked={this.state.activeSwitch}
            onChange={this.props.activeTail && this.handleActiveSwitch}
          />
        </div>
      </AppBar>
    );
  }
}
export default TopPanel;
