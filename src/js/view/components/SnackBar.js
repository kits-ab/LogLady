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
      key={props.snackbar.index}
      show={props.snackbar.show}
      fadeAfter={20000}
    >
      <Layout row>
        <Container grow pr-2 shrink>
          {props.snackbar.message}
        </Container>
        <Container>
          <TextButton
            color="#bb86fc"
            onClick={() => {
              hideSnackBar(props.dispatch);
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
    snackbar: state.snackBarReducer
  };
};

export default connect(mapStateToProps)(SnackBar);
