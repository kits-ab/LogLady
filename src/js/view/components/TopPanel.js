import {
  TopPanelContainer,
  TopPanelItem,
  FollowSetting,
  TopPanelItemText,
  TopPanelItemFiller,
  TopPanelLogoText
} from 'js/view/styledComponents/TopPanelStyledComponents';
import { OpenFileButton } from 'js/view/styledComponents/common/ButtonStyledComponents';
import { TextFieldInput } from 'js/view/components/common/input';
import { SwitchButton } from 'js/view/components/common/buttons';
import React from 'react';
import {
  handleFilterInput,
  handleHighlightInput,
  handleTailSwitch
} from 'js/view/actions/dispatchActions';
import { connect } from 'react-redux';
import { showOpenDialog } from './helpers/handleFileHelper';

const logoText = require('../../../resources/text.png');

class TopPanel extends React.Component {
  render() {
    return (
      <TopPanelContainer>
        <TopPanelItem>
          <TopPanelLogoText src={logoText} />
        </TopPanelItem>
        <TopPanelItem>
          <OpenFileButton
            onClick={() => {
              showOpenDialog();
            }}
          >
            Open file
          </OpenFileButton>
        </TopPanelItem>
        <TopPanelItem>
          <TextFieldInput
            placeholder="Filter"
            debounce={222}
            onTextChange={text => {
              handleFilterInput(this.props.dispatch, text);
            }}
            value={this.props.filterInput}
          />
        </TopPanelItem>
        <TopPanelItem>
          <TextFieldInput
            placeholder="Highlight"
            debounce={222}
            onTextChange={text => {
              handleHighlightInput(this.props.dispatch, text);
            }}
            value={this.props.highlightInput}
          />
        </TopPanelItem>
        <TopPanelItemFiller />
        <TopPanelItem>
          <FollowSetting>
            <SwitchButton
              checked={this.props.tailSwitch}
              onChange={() => {
                handleTailSwitch(this.props.dispatch);
              }}
            />
          </FollowSetting>
          <TopPanelItemText>Follow</TopPanelItemText>
        </TopPanelItem>
      </TopPanelContainer>
    );
  }
}

const mapStateToProps = ({
  menuState: { openFiles },
  topPanelState: { tailSwitch, filterInput, highlightInput }
}) => {
  return {
    openFiles,
    tailSwitch,
    filterInput,
    highlightInput
  };
};

export default connect(mapStateToProps)(TopPanel);
