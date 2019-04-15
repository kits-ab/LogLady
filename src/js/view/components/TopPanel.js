import * as TopPanelSC from '../styledComponents/TopPanelStyledComponents';
import React from 'react';
import { handleTailSwitch } from '../actions/dispatchActions';
import { connect } from 'react-redux';

class TopPanel extends React.Component {
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
              checked={this.props.tailSwitch}
              onChange={console.log('im constantly changing')}
            />
            <span />
          </TopPanelSC.TailSwitch>
        </TopPanelSC.Tail>
      </TopPanelSC.AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    tailSwitch: state.topPanelReducer.tailSwitch
  };
};

export default connect(mapStateToProps)(TopPanel);
