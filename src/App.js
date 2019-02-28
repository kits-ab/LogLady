import React, { Component } from 'react';
import logo from './log.jpg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>We log everything!</p>
          <a
            className="App-link"
            href="https://kits.se"
            target="_blank"
            rel="noopener noreferrer"
          >
            kits.se
          </a>
          <p>So all in allw</p>
        </header>
      </div>
    );
  }
}

export default App;
