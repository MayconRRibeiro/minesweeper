import React from 'react';
import Board from './Board.js';

class Game extends React.Component {
  renderBoard() {
    console.log(this.props.difficulty);
    console.log(this.props.x);
    if (this.props.difficulty === 'easy') {
      console.log('bruh');
      return <Board x={3} y={3} />;
    }
    if (this.props.difficulty === 'medium') {
      return <Board x={5} y={5} />;
    }
    if (this.props.difficulty === 'hard') {
      return <Board x={8} y={8} />;
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-info">
          {this.renderBoard()}
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
export default Game;
