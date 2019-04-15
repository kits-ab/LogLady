import * as TopPanelSC from '../styledComponents/TopPanelStyledComponents';
import React from 'react';
import {
  handleFilterInput,
  handleTailSwitch
} from '../actions/dispatchActions';
import { connect } from 'react-redux';

class TopPanel extends React.Component {
  _handleFilterInput = event => {
    handleFilterInput(this.props.dispatch, event.target.value);
  };
  render() {
    return (
      <TopPanelSC.AppBar>
        <p>LogLady</p>
        <TopPanelSC.TextFieldInput
          placeholder="filter"
          value={this.props.filterInput}
          onChange={e => {
            this._handleFilterInput(e);
          }}
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
              onChange={() => {
                handleTailSwitch(this.props.dispatch);
              }}
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
    tailSwitch: state.topPanelReducer.tailSwitch,
    filterInput: state.topPanelReducer.filterInput
  };
};

export default connect(mapStateToProps)(TopPanel);
