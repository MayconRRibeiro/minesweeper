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
      mineCount: ('000' + this.props.mines).substr(-3),
      mines: null,
      timer: null
    };
    this.add = this.add.bind(this);
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

  async resetBoard(height, width) {
    this.setState({
      boardData: this.initBoard(height, width),
      seconds: 0,
      gameStatus: 'running',
    });
    const mines = await this.fetchAllMines();
    this.setState({mines: mines, gameStatus: 'stop' });
    clearInterval(this.state.timer);
    console.log(this.state);
  }

  async deleteGame() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid;
    await fetch(url, {method: 'delete'});
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

  async revealAllMines(updatedData) {
    for (const mine of this.state.mines) {
      updatedData[mine.x][mine.y].isMine = true;
    }
  }

  async resize() {
    var cw = $('.cell').width();
    var c = $('.cell').value;
    $('.cell').css({height: cw + 'px'});
    if (cw - 4 > 6) {
      cw = cw - 4;
    }
    $('.cell').css({'font-size': cw});
  }

  async componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
    const mines = await this.fetchAllMines();
    this.setState({mines: mines});
    console.log(this.state);
  }

  async revealCells(dataFromChild) {
    let updatedData = this.state.boardData;
    for (const data of dataFromChild) {
      updatedData[data.x][data.y].isRevealed = true;
      updatedData[data.x][data.y].isFlagged = false;
      if (data.status === -1) {
        updatedData[data.x][data.y].isMine = true;
        this.setState({gameStatus: 'lost'});
        clearInterval(this.state.timer);
        await this.revealAllMines(updatedData);
        //this.deleteGame();
      } else {
        updatedData[data.x][data.y].neighbour = data.status;
      }
    }
    this.setState({
      boardData: updatedData,
    });
  }

  async add(){
    let seconds = this.state.seconds;
    if(seconds === 999){
      return;
    }
    seconds ++;
    this.setState({seconds:seconds});
    this.props.getTime(this.state.seconds);
  }

  async timer(){
    let timer = setInterval(this.add, 1000);
    this.setState({timer: timer});
  }

  async handleClick(x, y) {
    console.log(this.state.gameStatus);
    if (this.state.gameStatus == 'stop') {
      this.timer();
      this.setState({gameStatus: 'running'});
    }
    if (
      this.state.boardData[x][y].isRevealed ||
      this.state.boardData[x][y].isFlagged
    ) {
      return null;
    }
    this.fetchCellsToReveal(x, y);
  }

  checkWinCondition(data) {
    let cells = [];
    for (const datarow of data) {
      for (const dataitem of datarow) {
        if (!dataitem.isRevealed) {
          cells.push({x: dataitem.x, y: dataitem.y});
          if (cells.length > this.state.mines.length) {
            return false;
          }
        }
      }
    }
    let gameWon = false;
    for (const mine of this.state.mines) {
      gameWon = false;
      for (const cell of cells) {
        if (mine.x === cell.x && mine.y === cell.y) {
          gameWon = true;
        }
      }
      if (gameWon === false) {
        return false;
      }
    }
    return true;
  }

  _handleContextMenu(e, x, y) {
    e.preventDefault();
    let updatedData = this.state.boardData;
    let mines = this.state.mineCount;
    // check if already revealed
    if (updatedData[x][y].isRevealed) {
      return;
    }
    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
      this.props.toggle(mines);
    }
    this.setState({
      boardData: updatedData,
      mineCount: mines,
    });
  }

  async fetchBoard() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid + '/reveal';
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    return json.cells;
  }

  async componentDidUpdate() {
    let updatedData = this.state.boardData;
    if (this.checkWinCondition(updatedData) === true) {
      console.log('good game');
      let cells = await this.fetchBoard();
      for (const data of cells) {
        updatedData[data.x][data.y].isRevealed = true;
        if (data.status === -1) {
          updatedData[data.x][data.y].isFlagged = true;
          //this.deleteGame();
        } else {
          updatedData[data.x][data.y].neighbour = data.status;
        }
      }
      this.setState({
        boardData: updatedData,
      });
    }
  }

  onUnload = event => {
    event.preventDefault();
    event.returnValue = 'bruh';
  };

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
            cMenu={e => this._handleContextMenu(e, dataitem.x, dataitem.y)}
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
