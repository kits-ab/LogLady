import {
  TopPanelContainer,
  TopPanelItem,
  FollowSetting,
  TopPanelItemText,
  TopPanelItemFiller
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
class TopPanel extends React.Component {
  render() {
    return (
      <TopPanelContainer>
        <TopPanelItem>
          <TopPanelItemText>LogLady</TopPanelItemText>
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
          <TextFieldInput placeholder="filter" onChange={handleFilterInput} />
        </TopPanelItem>
        <TopPanelItem>
          <TextFieldInput
            placeholder="highlight"
            onChange={handleHighlightInput}
          />
        </TopPanelItem>
        <TopPanelItemFiller />
        <TopPanelItem>
          <FollowSetting>
            <SwitchButton checked onChange={handleTailSwitch} />
          </FollowSetting>
          <TopPanelItemText>Follow</TopPanelItemText>
        </TopPanelItem>
      </TopPanelContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(TopPanel);
