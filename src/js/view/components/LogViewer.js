import React from 'react';
import { findMatches } from './lineFilter_helper';
import Switch from '@material-ui/core/Switch';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      activeTail: true
    };

    this.liveLinesContainer = React.createRef();
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.lines.split('\n'));
    const matchArray = findMatches(this.props.filterInputFieldValue, lineArray);

    return matchArray;
  };

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);
  };

  handleActiveTail = () => {
    this.setState({
      activeTail: !this.state.activeTail
    });
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    this.state.activeTail &&
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
  };

  render() {
    const lines = this.props.lines && this.createLineArray();
    return (
      <div>
        {/* <input
          id="filterInput"
          type="text"
          placeholder="filter"
          value={this.props.filterInputFieldValue}
          onChange={this.props.filterInputField}
        />
        <input
          type="text"
          placeholder="highlight"
          value={this.props.higlightInputFieldValue}
          onChange={this.props.higlightInputField}
        />
        <div style={{ float: 'right', marginRight: '1.5%' }}>
          <span>Tail: </span>{' '}
          <Switch
            color="primary"
            checked={this.state.activeTail}
            onChange={this.handleActiveTail}
          />
        </div> */}
        <div
          ref={this.liveLinesContainer}
          style={{
            overflow: 'auto',
            height: '500px',
            border: '1px black solid',
            width: '97%',
            margin: '0.5% 1.5%'
          }}
        >
          {lines &&
            lines.map((line, i) => {
              return (
                <p
                  style={
                    line.match(
                      new RegExp(this.props.higlightInputFieldValue, 'gi')
                    ) && this.props.higlightInputFieldValue
                      ? { background: this.props.highlightColorInput }
                      : {}
                  }
                  key={i}
                >
                  {line}
                </p>
              );
            })}
        </div>
      </div>
    );
  }
}

export default LogViewer;
