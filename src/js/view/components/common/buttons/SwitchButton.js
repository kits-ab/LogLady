import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked
    };
  }

  render() {
    return (
      <SwitchContainer>
        <input
          type="checkbox"
          checked={this.state.checked}
          ref="checkbox"
          onChange={() => {
            this.setState({ checked: this.refs.checkbox.checked });
            this.props.onChange(
              this.props.dispatch,
              this.refs.checkbox.checked
            );
          }}
        />
        <span />
      </SwitchContainer>
    );
  }
}

export default connect()(SwitchButton);

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 25px;
  margin: 0 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #222;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
  span:before {
    position: absolute;
    content: '';
    height: 22.8px;
    width: 22.8px;
    left: 1px;
    bottom: 0.5px;
    background-color: #808080;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ivory;
  }
  input:checked + span:before {
    -webkit-transform: translateX(22.8px);
    -ms-transform: translateX(22.8px);
    transform: translateX(22.8px);
  }
`;
