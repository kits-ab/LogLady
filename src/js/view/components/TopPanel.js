import * as TopPanelSC from '../styledComponents/TopPanelStyledComponents';
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
      <TopPanelSC.AppBar>
        <p>LogLady</p>
        <TopPanelSC.TextFieldInput
          placeholder="filter"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
          type="text"
        />

        <TopPanelSC.TextFieldInput
          placeholder="highlight"
          value={this.props.higlightInputFieldValue}
          onChange={this.props.higlightInputField}
          type="text"
        />

        <TopPanelSC.Tail>
          <span>Tail: </span>

          <TopPanelSC.TailSwitch>
            <input
              type="checkbox"
              checked={this.state.activeSwitch}
              onChange={this.handleActiveSwitch}
            />
            <span />
          </TopPanelSC.TailSwitch>
        </TopPanelSC.Tail>
      </TopPanelSC.AppBar>
    );
  }
}
export default TopPanel;
