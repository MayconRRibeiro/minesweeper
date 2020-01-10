import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  render() {
    return (
      <button
        className="square"
        onClick={() => {
          this.setState({value: 'X'});
        }}
      >
        {this.state.value}{' '}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  multipleRender() {
    let a = [];
    let items = [];
    for (let j = 0; j < this.props.y; j++) {
      for (let i = 0; i < this.props.x; i++) {
        a.push(this.renderSquare(i));
      }
      items.push(<div className="board-row">{a}</div>);
      a = [];
    }
    return items;
  }

  render() {
    const status = 'Next player: X';
    console.log(this.props.x);
    return (
      <div>
        <div className="status">{status}</div>
        {this.multipleRender()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.difficulty = null;
  }
  renderBoard() {
    return <Board x={3} y={3} />;
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
