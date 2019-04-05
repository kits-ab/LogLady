import React from 'react';
import { findMatches } from './lineFilter_helper';
import Switch from '@material-ui/core/Switch';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineFilterText: '',
      autoScroll: true
    };

    this.liveLinesContainer = React.createRef();
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.lines.split('\n'));
    const matchArray = findMatches(this.props.filterInputFieldValue, lineArray);

    return matchArray;
  };

  componentDidUpdate = () => {
    if (this.state.autoScroll !== this.props.activeTail) {
      this.handleAutoScroll();
    }
  };

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);
  };

  handleAutoScroll = () => {
    !this.state.autoScroll &&
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    this.setState({
      autoScroll: !this.state.autoScroll
    });
  };

  scrollToBottom = () => {
    if (this.state.autoScroll) {
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    }
  };

  render() {
    const lines = this.props.lines && this.createLineArray();
    return (
      <div>
        <div
          ref={this.liveLinesContainer}
          style={{
            overflow: 'auto',
            height: '535px',
            border: '1px black solid',
            width: '97%',
            margin: '70px 1.5% 0 1.5%'
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
