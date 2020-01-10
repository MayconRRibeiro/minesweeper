import React, {Component} from 'react';
import Game from './Game.js';

class Home extends Component {
  render() {
    return (
      <div className="game-board">
        <Game difficulty={'hard'}  />
      </div>
    );
  }
}

export default Home;
