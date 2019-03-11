const React = require('react');
const { Component } = require('react');
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    this.setLines = this.setLines.bind(this);
    this.ipcContainer = this.ipcContainer.bind(this);
    this.state = {
      lines: ''
    };
    this.ipcContainer();
  }
  setLines(arg) {
    this.setState({
      lines: arg
    });
  }

  ipcContainer() {
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      this.setLines(arg);
      console.log('arg in app.js: ', arg);
    });
    ipcRenderer.send('asynchronous-message', 'getLines');
  }

  render() {
    return (
      <div>
        <p>hej värld</p>
        <p>Lines: {this.state.lines}</p>
      </div>
    );
  }
}

export default App;
