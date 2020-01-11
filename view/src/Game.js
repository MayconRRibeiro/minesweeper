import React from 'react';
import Board from './Board.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: null,
      y: null,
      gameid: null,
      mines: null,
    };
  }

  renderBoard() {
    if (this.props.difficulty === 'easy') {
      //console.log('bruh');
      return <Board x={3} y={3} gameid={this.state.gameid} />;
    }
    if (this.props.difficulty === 'medium') {
      return <Board x={5} y={5} gameid={this.state.gameid} />;
    }
    if (this.props.difficulty === 'hard') {
      return <Board x={8} y={8} gameid={this.state.gameid} />;
    }
  }

  async componentWillMount(){
    let gameid = await this.startGame();
    this.setState({gameid})
  }

  async startGame() {
    const url = new URL('http://127.0.0.1:8080/game/');
    const params = {difficulty: 'easy'};
    url.search = new URLSearchParams(params).toString();
    var response = await fetch(url, {method: 'POST'});
    const json = await response.json();
    return json.id;
  }

  //async componentDidMount() {
    ////await this.startGame();
    ////console.log(this.state.gameid);
    ////this.test(this.state.gameid);
  //}

  render() {
    console.log(this.state.gameid);
    return <div className="game">{this.renderBoard()}</div>;
  }
}

export default Game;
