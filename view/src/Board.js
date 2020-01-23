import React from 'react';
import $ from 'jquery';
import Cell from './Cell.js';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: this.initBoard(this.props.height, this.props.width),
      seconds: 0,
      gameStatus: 'stop',
      mineCount: this.props.mines,
      flagsCount: 0,
      mines: null,
      timer: null,
      flagButtonClicked: false,
    };
  }

  initBoard(height, width) {
    let data = [];
    for (let x = 0; x < height; x++) {
      data.push([]);
      for (let y = 0; y < width; y++) {
        data[x][y] = {
          x: x,
          y: y,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  async resetBoard(height, width, mineCount) {
    this.setState({
      boardData: this.initBoard(height, width),
      seconds: 0,
      gameStatus: 'running',
    });
    const mines = await this.fetchAllMines();
    this.setState({
      mines: mines,
      gameStatus: 'stop',
      mineCount: mineCount,
      flagsCount: 0,
    });
    this.props.getStatus(this.state.gameStatus);
    clearInterval(this.state.timer);
  }

  async fetchBoard() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid + '/reveal';
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    return json.cells;
  }

  async fetchCellsToReveal(x, y) {
    const url =
      'http://127.0.0.1:8080/game/' + this.props.gameid + '/' + x + '/' + y;
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    this.revealCells(json.cells);
  }

  async fetchAllMines() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid + '/mines';
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    let result = [];
    for (const mine of json.cells) {
      result.push({x: mine.x, y: mine.y});
    }
    return result;
  }

  async deleteGame() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid;
    await fetch(url, {method: 'delete'});
  }

  async revealCells(dataFromChild) {
    let updatedData = this.state.boardData;
    for (const data of dataFromChild) {
      updatedData[data.x][data.y].isRevealed = true;
      updatedData[data.x][data.y].isFlagged = false;
      if (data.status === -1) {
        updatedData[data.x][data.y].isMine = true;
        this.setState({gameStatus: 'lost'});
        this.props.getStatus(this.state.gameStatus);
        clearInterval(this.state.timer);
        this.revealAllMines(updatedData);
        this.deleteGame();
      } else {
        updatedData[data.x][data.y].neighbour = data.status;
      }
    }
    this.setState({
      boardData: updatedData,
    });
  }

  revealAllMines(updatedData) {
    for (const mine of this.state.mines) {
      updatedData[mine.x][mine.y].isMine = true;
    }
  }

  flagCell(x, y) {
    if (this.state.gameStatus === 'stop') {
      this.timer();
      this.setState({gameStatus: 'running'});
      this.props.getStatus(this.state.gameStatus);
    }
    let updatedData = this.state.boardData;
    let mines = this.state.mineCount;
    let flags = this.state.flagsCount;
    if (updatedData[x][y].isRevealed) {
      return;
    }
    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      flags--;
    } else {
      updatedData[x][y].isFlagged = true;
      flags++;
    }
    if (flags > this.props.mines) {
      mines = 0;
    } else {
      mines = mines - flags;
      if (mines < 0) {
        mines = 0;
      } else if (mines > this.props.mines) {
        mines = this.props.mines;
      }
    }
    this.props.toggle(mines);
    this.setState({
      boardData: updatedData,
      flagsCount: flags,
    });
  }

  async handleClick(x, y) {
    if (this.state.gameStatus === 'stop') {
      this.timer();
      this.setState({gameStatus: 'running'});
      this.props.getStatus(this.state.gameStatus);
    }
    if (this.state.flagButtonClicked === true) {
      this.flagCell(x, y);
    } else {
      if (
        this.state.boardData[x][y].isRevealed ||
        this.state.boardData[x][y].isFlagged
      ) {
        return null;
      }
      this.fetchCellsToReveal(x, y);
    }
  }

  handleLeftClick(e, x, y) {
    e.preventDefault();
    this.flagCell(x, y);
  }

  checkWinCondition(data) {
    let flags = [];
    let openCells = [];
    for (const datarow of data) {
      for (const dataitem of datarow) {
        if (!dataitem.isRevealed) {
          openCells.push({x: dataitem.x, y: dataitem.y});
        }
        if (dataitem.isFlagged) {
          flags.push({x: dataitem.x, y: dataitem.y});
        }
      }
    }
    if (openCells.length === this.state.mines.length) {
      return true;
    }
    let gameWon = false;
    for (const mine of this.state.mines) {
      gameWon = false;
      if (flags.length <= this.state.mines.length) {
        for (const flag of flags) {
          if (mine.x === flag.x && mine.y === flag.y) {
            gameWon = true;
          }
        }
      }
      if (gameWon === false) {
        return false;
      }
    }
    return true;
  }

  addSecond = () => {
    let seconds = this.state.seconds;
    if (seconds === 999) {
      return;
    }
    seconds++;
    this.setState({seconds: seconds});
    this.props.getTime(this.state.seconds);
  };

  timer() {
    let timer = setInterval(this.addSecond, 1000);
    this.setState({timer: timer});
  }

  resize() {
    var cw = $('.cell').width();
    $('.cell').css({height: cw + 'px'});
    if (cw - 4 > 6) {
      cw = cw - 4;
    }
    $('.cell').css({'font-size': cw});
  }

  onUnload(event) {
    event.preventDefault();
  }

  async componentDidUpdate() {
    let updatedData = this.state.boardData;
    if (this.checkWinCondition(updatedData) === true) {
      clearInterval(this.state.timer);
      let cells = await this.fetchBoard();
      for (const data of cells) {
        updatedData[data.x][data.y].isRevealed = true;
        if (data.status === -1) {
          updatedData[data.x][data.y].isFlagged = true;
          this.deleteGame();
        } else {
          updatedData[data.x][data.y].neighbour = data.status;
        }
      }
      this.setState({
        boardData: updatedData,
        gameStatus: 'won',
      });
      this.props.getStatus(this.state.gameStatus);
    }
  }

  async componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
    const mines = await this.fetchAllMines();
    this.setState({mines: mines});
  }

  componentWillUnmount() {
    window.addEventListener('beforeunload', this.onUnload);
  }

  renderBoard(data) {
    let a = [];
    let items = [];
    let clsName = 'board-row board-row-' + this.props.difficulty;
    for (const datarow of data) {
      for (const dataitem of datarow) {
        a.push(
          <Cell
            onClick={() => this.handleClick(dataitem.x, dataitem.y)}
            onLeftClick={e => this.handleLeftClick(e, dataitem.x, dataitem.y)}
            value={dataitem}
          />
        );
      }
      items.push(<div className={clsName}>{a}</div>);
      a = [];
    }
    return <div className="board">{items}</div>;
  }

  render() {
    return <div>{this.renderBoard(this.state.boardData)}</div>;
  }
}

export default Board;
