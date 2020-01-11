import React from 'react';
import Cell from './Cell.js';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: Array(9).fill(null),
    };
  }

  renderCell() {
    return <Cell gameid={this.props.gameid} />;
  }

  multipleRender() {
    let a = [];
    let items = [];
    for (let j = 0; j < this.props.y; j++) {
      for (let i = 0; i < this.props.x; i++) {
        a.push(this.renderCell(i));
      }
      items.push(<div className="board-row">{a}</div>);
      a = [];
    }
    return items;
  }

  render() {
    return <div className="board">{this.multipleRender()}</div>;
  }
}

export default Board;
