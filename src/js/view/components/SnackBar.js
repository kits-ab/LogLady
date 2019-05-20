import React from 'react';
import { TextButton } from 'js/view/styledComponents/common/ButtonStyledComponents';
import { hideSnackBar } from 'js/view/actions/dispatchActions';
import {
  Container,
  Layout
} from 'js/view/styledComponents/common/FlexBoxStyledComponents';
import { connect } from 'react-redux';
import CommonSnackBar from 'js/view/components/common/snackbar/SnackBar';

function SnackBar(props) {
  return (
    <CommonSnackBar
      key={props.snackBar.message + props.snackBar.level}
      show={props.snackBar.show}
      fadeAfter={props.snackBar.fadeAfter}
    >
      <Layout row>
        <Container grow>{props.snackBar.message}</Container>
        <Container>
          <TextButton
            color="#bb86fc"
            onClick={() => {
              hideSnackBar(props.dispatch, true);
            }}
          >
            DISMISS
          </TextButton>
        </Container>
      </Layout>
    </CommonSnackBar>
  );
}

const mapStateToProps = state => {
  return {
    snackBar: state.snackBarReducer
  };
};

export default connect(mapStateToProps)(SnackBar);
