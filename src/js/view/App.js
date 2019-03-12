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
    console.log('nth Lines: ', this.state.nthLines);
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
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      switch (arg.functionThatReplied) {
        //Just to show that our listener can be live.
        case 'time':
          this.setTime(arg.returnValue);
          break;
        case 'getLastLines':
          this.setLastLines(arg.returnValue);
          break;
        case 'getNthLines':
          this.setNthLines(JSON.stringify(arg.returnValue, null, 2));
          break;
        case 'getNumberOfLines':
          this.setNumberOfLines(arg.returnValue);
          break;
        default:
          window.alert('Error has occured: ', arg.returnValue);
      }
      console.log('arg in app.js: ', arg);
    });

    //Create an object and pass it as arg to ipcRenderer.send()
    let argObj = {};
    argObj.functionToCall = 'getLastLines';
    argObj.filePath = 'src/resources/myLittleFile.txt';
    argObj.numberOfLines = 5;
    argObj.lineNumber = 10;
    ipcRenderer.send('asynchronous-message', argObj);

    argObj.functionToCall = 'getNthLines';
    ipcRenderer.send('asynchronous-message', argObj);

    argObj.functionToCall = 'getNumberOfLines';
    ipcRenderer.send('asynchronous-message', argObj);

    argObj.functionToCall = 'getTime';
    ipcRenderer.send('asynchronous-message', argObj);
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
        <p>
          Get Nth lines (with {'<pre>'} tags to keep json formatting):
          <pre>{this.state.nthLines}</pre>
        </p>
      </div>
    );
  }
}

export default App;
