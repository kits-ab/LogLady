import { throws } from 'assert';

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
      numberOfLines: '',
      liveLines: 'hej',
      autoScroll: true
    };

    this.ipcContainer();
  }

  setLiveLines = _returnValue => {
    this.setState({
      liveLines: this.state.liveLines + '\n' + _returnValue
    });
  };

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

    //comment out next line if not using lologoggenerator
    argObj.filePath = '../lologoggenerator/app/lologog/testLog.txt';
    ipcRenderer.send('getLiveLines', argObj);

    ipcRenderer.on('liveLines', (event, lines) => {
      this.setLiveLines(lines);
    });

    ipcRenderer.send('getNumberOfLines', argObj);

    ipcRenderer.once('numberOfLines', (event, numberOfLines) => {
      console.log(numberOfLines);
      this.setNumberOfLines(numberOfLines);
    });

    ipcRenderer.send('getNthLines', argObj);

    ipcRenderer.once('nthLines', (event, lines) => {
      console.log(lines);
      this.setNthLines(JSON.stringify(lines, null, 2));
    });

    ipcRenderer.send('getLastLines', argObj);

    ipcRenderer.once('lastLines', (event, lastLines) => {
      this.setLastLines(lastLines);
    });

    window.addEventListener('keydown', e => {
      if (e.keyCode === 32) {
        this.handleAutoScroll();
      }
    });
  };

  handleAutoScroll = () => {
    this.setState({
      autoScroll: !this.state.autoScroll
    });
  };

  render() {
    this.state.autoScroll && window.scrollTo(0, document.body.scrollHeight);

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
        <pre>Get live lives: {this.state.liveLines}</pre>
      </div>
    );
  }
}

export default App;
