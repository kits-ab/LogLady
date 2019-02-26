import React, { Component } from 'react';
import { Lead } from '@kokitotsos/react-components';
import logo from './log.jpg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Lead>We log everything</Lead>
          <a
            className="App-link"
            href="https://kits.se"
            target="_blank"
            rel="noopener noreferrer"
          >
            kits.se
          </a>
        </header>
      </div>
    );
  }
}

export default App;
