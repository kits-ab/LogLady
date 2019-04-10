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
    this.props.activeTail();
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
        <p style={{ margin: '12px 28px 0 28px', color: '#222' }}>LogLady</p>
        <div style={{ width: '15%', margin: '0 5px' }}>
          <TextField
            placeholder="filter"
            value={this.props.filterInputFieldValue}
            onChange={this.props.filterInputField}
            margin="dense"
            variant="outlined"
            style={{ margin: '10px 20px', height: '30px' }}
            fullWidth="true"
          />
        </div>
        <div style={{ width: '15%', margin: '0 5px' }}>
          <TextField
            placeholder="highlight"
            value={this.props.higlightInputFieldValue}
            onChange={this.props.higlightInputField}
            margin="dense"
            variant="outlined"
            style={{ margin: '10px 20px', height: '30px' }}
            fullWidth="true"
          />
        </div>

        <div style={{ marginLeft: 'auto', marginRight: '1.5%' }}>
          <span style={{ color: '#222' }}>Tail: </span>{' '}
          <Switch
            color="primary"
            checked={this.state.activeSwitch}
            onChange={this.handleActiveSwitch}
          />
        </div>
      </AppBar>
    );
  }
}
export default TopPanel;
