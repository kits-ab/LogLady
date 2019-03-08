const React = require('react');
const { Component } = require('react');

const engine = require('./js/engine/engine');

console.log(engine.readLines());

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>{hej}</p>
      </div>
    );
  }
}

export default App;
