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
  constructor(props) {
    super(props);
    this.state = {
      filterInput: '',
      highlightInput: '',
      tailOn: true
    };
  }
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
          value={this.state.filterInput}
          onChange={e => {
            this.setState({ filterInput: e.target.value });
            handleFilterInput(this.props.dispatch, e.target.value);
          }}
          type="text"
        />

        <TopPanelSC.TextFieldInput
          placeholder="highlight"
          value={this.state.highlightInput}
          onChange={e => {
            this.setState({ highlightInput: e.target.value });
            handleHighlightInput(this.props.dispatch, e.target.value);
          }}
          type="text"
        />

        <TopPanelSC.Tail>
          <span>Tail:</span>

          <TopPanelSC.TailSwitch>
            <input
              type="checkbox"
              checked={this.state.tailOn}
              ref="tailSwitch"
              onChange={() => {
                this.setState({ tailOn: this.refs.tailSwitch.checked });
                handleTailSwitch(
                  this.props.dispatch,
                  this.refs.tailSwitch.checked
                );
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
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(TopPanel);
