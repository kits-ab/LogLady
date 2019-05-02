import * as TopPanelSC from '../styledComponents/TopPanelStyledComponents';
import { OpenFileButton } from '../styledComponents/common/ButtonStyledComponents';
import React from 'react';
import {
  handleFilterInput,
  handleHighlightInput,
  handleTailSwitch
} from '../actions/dispatchActions';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';
class TopPanel extends React.Component {
  render() {
    return (
      <TopPanelSC.TopPanel>
        <p>LogLady</p>
        <OpenFileButton
          onClick={() => {
            showOpenDialog();
          }}
        >
          Open file
        </OpenFileButton>
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
          <span>Follow:</span>

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
    highlightInput: state.topPanelReducer.highlightInput,
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(TopPanel);
