import Feed from './components/Feed';
const React = require('react');
const { Component } = require('react');
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastLines: '',
      nthLines: '',
      time: '',
      numberOfLines: ''
    };

    this.ipcContainer();
  }
  setLastLines = _returnValue => {
    this.setState({
      lastLines: _returnValue
    });
  };

  setNthLines = _returnValue => {
    this.setState({
      nthLines: _returnValue
    });
    //console.log('nth Lines: ', this.state.nthLines);
  };

  setTime = _returnValue => {
    let theTime = new Date(_returnValue);

    this.setState({
      time:
        theTime.toLocaleTimeString('sv-SE') + ':' + theTime.getMilliseconds()
    });
  };

  setNumberOfLines = _returnValue => {
    this.setState({
      numberOfLines: _returnValue
    });
  };

  ipcContainer = () => {
    //Create an object and pass it as arg to ipcRenderer.send()
    let argObj = {};
    argObj.filePath = 'src/resources/myLittleFile.txt';
    argObj.numberOfLines = 5;
    argObj.lineNumber = 10;

    //Just to show that our listener can be live.
    ipcRenderer.send('getTime', 'time');

    ipcRenderer.on('theTime', (event, time) => {
      this.setTime(time);
    });

    ipcRenderer.send('getNumberOfLines', argObj);

    ipcRenderer.on('nol', (event, nol) => {
      console.log(nol);
      this.setNumberOfLines(nol);
    });

    ipcRenderer.send('getNthLines', argObj);

    ipcRenderer.on('theLines', (event, lines) => {
      console.log(lines);
      this.setNthLines(JSON.stringify(lines, null, 2));
    });

    ipcRenderer.send('getLastLines', argObj);

    ipcRenderer.on('lastLines', (event, lastLines) => {
      this.setLastLines(lastLines);
    });
  };

  render() {
    return (
      <div>
        <p>hej värld</p>
        <p>
          Our listener can be live (and can keep up with ms): {this.state.time}{' '}
        </p>
        <p>Get number of lines: {this.state.numberOfLines}</p>
        <p>Get last lines: {this.state.lastLines}</p>
        <p>
          Get Nth lines (5 rows starting from row 10): {this.state.nthLines}
        </p>
        Get Nth lines (with {'<pre>'} tags to keep json formatting):
        <pre>{this.state.nthLines}</pre>
        <Feed rows={this.state.lastLines} />
      </div>
    );
  }
}

export default App;
