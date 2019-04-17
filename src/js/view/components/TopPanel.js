import * as TopPanelSC from '../styledComponents/TopPanelStyledComponents';
import React from 'react';
import {
  handleFilterInput,
  handleHighlightInput,
  handleTailSwitch
} from '../actions/dispatchActions';
import { connect } from 'react-redux';

class TopPanel extends React.Component {
  render() {
    return (
      <TopPanelSC.TopPanel>
        <p>LogLady</p>
        <TopPanelSC.TextFieldInput
          placeholder="filter"
          value={this.props.filterInput}
          onChange={e => {
            handleFilterInput(this.props.dispatch, e.target.value);
          }}
          type="text"
        />

        <TopPanelSC.TextFieldInput
          placeholder="highlight"
          value={this.props.highlightInput}
          onChange={e => {
            handleHighlightInput(this.props.dispatch, e.target.value);
          }}
          type="text"
        />

        <TopPanelSC.Tail>
          <span>Tail:</span>

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
      </TopPanelSC.TopPanel>
    );
  }
}

const mapStateToProps = state => {
  return {
    tailSwitch: state.topPanelReducer.tailSwitch,
    filterInput: state.topPanelReducer.filterInput,
    highlightInput: state.topPanelReducer.highlightInput
  };
};

export default connect(mapStateToProps)(TopPanel);
