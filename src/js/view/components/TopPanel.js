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
      <AppBar
        style={{
          backgroundColor: '#ddd',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          position: 'fixed'
        }}
      >
        <p style={{ margin: '1.5em', color: '#222' }}>LogLady</p>
        <TextField
          label="filter"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
          margin="dense"
          variant="outlined"
          style={{ margin: '0.7em' }}
        />
        <TextField
          label="filter"
          value={this.props.higlightInputFieldValue}
          onChange={this.props.higlightInputField}
          margin="dense"
          variant="outlined"
          style={{ margin: '0.7em' }}
        />

        <div style={{ margin: '0.8% 0 0 58%' }}>
          <span style={{ color: '#222' }}>Tail: </span>{' '}
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
