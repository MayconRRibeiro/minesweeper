import React from 'react';
import Board from './Board.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameid: null,
      height: 8,
      width: 8,
      mines: 10,
    };
  }

  async componentWillMount() {
    await this.startGame();
    await this.getGameParams();
  }

  async startGame() {
    const url = new URL('http://127.0.0.1:8080/game/');
    const params = {difficulty: this.props.difficulty};
    url.search = new URLSearchParams(params).toString();
    var response = await fetch(url, {method: 'POST'});
    const json = await response.json();
    this.setState({gameid: json.id});
  }

  async getGameParams() {
    const url = 'http://127.0.0.1:8080/game/' + this.state.gameid;
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    this.setState({width:json.x, height:json.y, mines: json.minesCount});
  }

  render() {
    const {height, width, mines} = this.state;
    return (
      <div className="game">
        <Board
          height={height}
          width={width}
          mines={mines}
          gameid={this.state.gameid}
        />
      </div>
    );
  }
}

export default Game;
