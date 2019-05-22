import React from 'react';
import { TextButton } from 'js/view/styledComponents/common/ButtonStyledComponents';
import { hideSnackBar } from 'js/view/actions/dispatchActions';
import {
  Container,
  Layout
} from 'js/view/styledComponents/common/FlexBoxStyledComponents';
import { connect } from 'react-redux';
import CommonSnackBar from 'js/view/components/common/snackbar/SnackBar';

const SnackBar = props => {
  return (
    <CommonSnackBar
      key={props.message + props.level}
      show={props.show}
      fadeAfter={props.fadeAfter}
    >
      <Layout row>
        <Container grow>{props.message}</Container>
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
};

const mapStateToProps = state => {
  return {
    message: state.snackBarReducer.message,
    show: state.snackBarReducer.show,
    fadeAfter: state.snackBarReducer.fadeAfter,
    level: state.snackBarReducer.level
  };
};

export default connect(mapStateToProps)(SnackBar);
