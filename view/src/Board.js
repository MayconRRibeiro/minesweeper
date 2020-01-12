import React from 'react';
import $ from 'jquery';
import Cell from './Cell.js';
import fitty from 'fitty';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: this.initBoardData(
        this.props.height,
        this.props.width,
        this.props.mines
      ),
      gameStatus: 'Game in progress',
      mineCount: this.props.mines,
    };
  }

  initBoardData(height, width, mines) {
    let data = this.createEmptyArray(height, width);
    //console.log(height);
    return data;
  }

  createEmptyArray(height, width) {
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

  async deleteGame() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid;
    await fetch(url, {method: 'delete'});
  }

  async getCellsToReveal(x, y) {
    const url =
      'http://127.0.0.1:8080/game/' + this.props.gameid + '/' + x + '/' + y;
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    this.revealCells(json.cells);
  }

  async resize() {
    var cw = $('.cell').width();
    $('.cell').css({height: cw + 'px'});
    if(cw - 4 > 6){
      cw = cw -4;
    }
    console.log(cw);
    $('.cell').css({'font-size': cw})
  }
  async componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }
  revealCells = dataFromChild => {
    let updatedData = this.state.boardData;
    for (const data of dataFromChild) {
      updatedData[data.x][data.y].isRevealed = true;
      updatedData[data.x][data.y].isFlagged = false;
      if (data.status === -1) {
        updatedData[data.x][data.y].isMine = true;
        this.setState({gameStatus: 'You Lost.'});
        this.deleteGame();
      } else {
        updatedData[data.x][data.y].neighbour = data.status;
      }
    }
    this.setState({
      boardData: updatedData,
    });
  };

  async handleClick(x, y) {
    if (
      this.state.boardData[x][y].isRevealed ||
      this.state.boardData[x][y].isFlagged
    ) {
      return null;
    }
    this.getCellsToReveal(x, y);
  }

  _handleContextMenu(e, x, y) {
    e.preventDefault();
    let updatedData = this.state.boardData;
    let mines = this.state.mineCount;
    // check if already revealed
    if (updatedData[x][y].isRevealed) return;
    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }
    if (mines === 0) {
      this.deleteGame();
      return;
      const mineArray = this.getMines(updatedData);
      const FlagArray = this.getFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
        this.setState({mineCount: 0, gameStatus: 'You Win.'});
        this.revealBoard();
        alert('You Win');
      }
    }
    this.setState({
      boardData: updatedData,
      mineCount: mines,
    });
  }

  renderBoard(data) {
    let a = [];
    let items = [];
    for (const datarow of data) {
      for (const dataitem of datarow) {
        //console.log(dataitem);
        a.push(
          <Cell
            onClick={() => this.handleClick(dataitem.x, dataitem.y)}
            cMenu={e => this._handleContextMenu(e, dataitem.x, dataitem.y)}
            value={dataitem}
            //console.log(data.map);
            cb={this.revealCells}
          />
        );
      }
      items.push(<div className="board-row">{a}</div>);
      a = [];
    }
    return <div className="board">{items}</div>;
    //return data.map(datarow => {
    //console.log(datarow);
    //return datarow.map(dataitem => {
    //return (
    //<div>
    //<Cell
    //onClick={() => this.handleClick(dataitem.x, dataitem.y)}
    //cMenu={e => this._handleContextMenu(e, dataitem.x, dataitem.y)}
    //value={dataitem}
    //cb={this.revealCells}
    ///>
    //{datarow[datarow.length - 1] === dataitem ? (
    //<div className="clear" />
    //) : (
    //''
    //)}
    //</div>
    //);
    //});
    //});
  }

  render() {
    return (
      <div>
        <div className="game-info">
          <h1 className="info">{this.state.gameStatus}</h1>
          <span className="info">Mines remaining: {this.state.mineCount}</span>
        </div>
        {this.renderBoard(this.state.boardData)}
      </div>
    );
  }
}

export default Board;
