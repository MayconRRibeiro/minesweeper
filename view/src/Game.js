import React from 'react';
import {NavLink} from 'react-router-dom';
import logo from './images/bomb.png';
import Board from './Board.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameid: null,
      height: null,
      width: null,
      mines: null,
    };
  }

  async startGame() {
    const url = new URL('http://127.0.0.1:8080/game/');
    const params = {difficulty: this.props.difficulty};
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, {method: 'POST'});
    const json = await response.json();
    this.setState({gameid: json.id});
  }

  async getGameParams() {
    const url = 'http://127.0.0.1:8080/game/' + this.state.gameid;
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    this.setState({width: json.x, height: json.y, mines: json.minesCount});
  }

  async componentWillMount() {
    await this.startGame();
    await this.getGameParams();
  }

  render() {
    const {height, width, mines} = this.state;
    if (height != null && width != null && mines != null) {
      return (
        <div className="ts">
          <div className="game">
            <div className="menu">
              <img src={logo} className="logo" />
              <div className="name">Minesweeper</div>
              <div className="close">
                <NavLink exact to="/" href="">
                  X
                </NavLink>
              </div>
            </div>
            <Board
              height={height}
              width={width}
              mines={mines}
              gameid={this.state.gameid}
              difficulty={this.props.difficulty}
            />
          </div>
          <div className="buttons">
            <button className="choose-click hidden">flag</button>
            <button className="choose-flag">click</button>
          </div>
        </div>
      );
    }
    return <div className="game"></div>;
  }
}

export default Game;
