import React from 'react';
import $ from 'jquery';
import {NavLink} from 'react-router-dom';
import logo from './images/bomb.png';
import Board from './Board.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: null,
      gameid: null,
      height: null,
      width: null,
      mines: null,
      minesRemaining: null,
      time: null,
      gameStatus: '😀',
    };
    this.boardElement = React.createRef();
  }

  async startGame() {
    const url = new URL('http://127.0.0.1:8080/game/');
    this.setState({difficulty: this.props.difficulty});
    const params = {difficulty: this.props.difficulty};
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, {method: 'POST'});
    const json = await response.json();
    this.setState({gameid: json.id});
  }

  reload = async () => {
    await this.startGame();
    await this.getGameParams();
    this.boardElement.current.resetBoard(
      this.state.height,
      this.state.width,
      this.state.mines
    );
  };

  async getGameParams() {
    const url = 'http://127.0.0.1:8080/game/' + this.state.gameid;
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    this.setState({
      width: json.x,
      height: json.y,
      mines: json.minesCount,
      minesRemaining: ('000' + json.minesCount).substr(-3),
      time: '000',
    });
  }

  getMinesRemainingCallback = dataFromChild => {
    this.setState({minesRemaining: ('000' + dataFromChild).substr(-3)});
  };

  getTimeCallback = dataFromChild => {
    this.setState({time: ('000' + dataFromChild).substr(-3)});
  };

  getGameStatusCallback = datFromChild => {
    if (datFromChild === 'running' || datFromChild === 'stop') {
      this.setState({gameStatus: '😀'});
    } else if (datFromChild === 'lost') {
      this.setState({gameStatus: '😖'});
    } else if (datFromChild === 'won') {
      this.setState({gameStatus: '😎'});
    }
  };

  clickButtonEvent = () => {
    this.boardElement.current.setState({flagButtonClicked: false});
    let btn = $('.click');
    if (!btn.hasClass('not-clicked')) {
      return;
    }
    let btns = $('.btn');
    btns.toggleClass('not-clicked');
  };

  flagButtonEvent = () => {
    this.boardElement.current.setState({flagButtonClicked: true});
    let btn = $('.flag');
    if (!btn.hasClass('not-clicked')) {
      return;
    }
    let btns = $('.btn');
    btns.toggleClass('not-clicked');
  };

  async componentWillMount() {
    await this.startGame();
    await this.getGameParams();
  }

  render() {
    const {
      difficulty,
      height,
      width,
      mines,
      minesRemaining,
      time,
    } = this.state;
    if (
      difficulty != null &&
      height != null &&
      width != null &&
      mines != null &&
      minesRemaining != null &&
      time != null
    ) {
      return (
        <div className="ts">
          <div className="game">
            <div className="menu">
              <img src={logo} className="logo" alt="logo" />
              <div className="name">Minesweeper</div>
              <div className="close">
                <NavLink exact to="/" href="">
                  X
                </NavLink>
              </div>
            </div>
            <div className="overlay">
              <div className="game-info">
                <div className="mines">
                  <span className="centered-text">{minesRemaining}</span>
                </div>
                <div className="info hidden" onClick={this.reload}>
                  <span>{this.state.gameStatus}</span>
                </div>
                <div className="timer">
                  <span className="centered-text">{time}</span>
                </div>
              </div>
            </div>
            <Board
              ref={this.boardElement}
              height={height}
              width={width}
              mines={mines}
              gameid={this.state.gameid}
              difficulty={this.props.difficulty}
              toggle={this.getMinesRemainingCallback}
              getTime={this.getTimeCallback}
              getStatus={this.getGameStatusCallback}
            />
          </div>
          <div className="buttons">
            <button className="btn click" onClick={this.clickButtonEvent}>
              <span role="img" aria-label="click">
                🖱️
              </span>
            </button>
            <button
              className="btn flag not-clicked"
              onClick={this.flagButtonEvent}
            >
              <span role="img" aria-label="flag">
                🚩
              </span>
            </button>
          </div>
        </div>
      );
    }
    return <div className="game">Loading</div>;
  }
}

export default Game;
